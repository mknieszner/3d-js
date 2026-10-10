import assert from 'node:assert/strict';

const HEADER_SIZE = 27;
const RECORD_SIZE = 25;
const TEXTURE_TYPES = new Set(['Video', 'Texture', 'LayeredTexture']);

// Preserve raw property bytes, including compressed geometry and animation arrays.
// Only the absolute record offsets need rewriting when texture records disappear.
function readFbx(buffer) {
    assert.equal(buffer.subarray(0, 23).toString('binary'), 'Kaydara FBX Binary  \0\x1a\0');
    assert.equal(buffer.readUInt32LE(23), 7700, 'Only the source FBX 7700 files are supported');

    function readNode(offset) {
        const end = Number(buffer.readBigUInt64LE(offset));
        if (end === 0) {
            assert(buffer.subarray(offset, offset + RECORD_SIZE).equals(Buffer.alloc(RECORD_SIZE)));
            return null;
        }
        const count = Number(buffer.readBigUInt64LE(offset + 8));
        const propertySize = Number(buffer.readBigUInt64LE(offset + 16));
        const nameSize = buffer[offset + 24];
        const propertyStart = offset + RECORD_SIZE + nameSize;
        let cursor = propertyStart + propertySize;
        assert(cursor <= end && end <= buffer.length, 'Invalid FBX record bounds');
        const node = {
            name: buffer.subarray(offset + RECORD_SIZE, propertyStart).toString('utf8'),
            count,
            properties: buffer.subarray(propertyStart, cursor),
            children: [],
            terminated: false,
        };
        while (cursor < end) {
            const child = readNode(cursor);
            if (!child) {
                cursor += RECORD_SIZE;
                node.terminated = true;
                break;
            }
            node.children.push(child.node);
            cursor = child.end;
        }
        assert.equal(cursor, end, 'Invalid FBX child record boundary');
        return {node, end};
    }

    const nodes = [];
    let cursor = HEADER_SIZE;
    while (true) {
        const result = readNode(cursor);
        if (!result) {
            cursor += RECORD_SIZE;
            break;
        }
        nodes.push(result.node);
        cursor = result.end;
    }
    const footer = buffer.subarray(cursor);
    assert(footer.length >= 160 && footer.length <= 176, 'Unexpected FBX footer');
    return {header: buffer.subarray(0, HEADER_SIZE), nodes, footer};
}

// Object IDs, connection endpoints and definition counts only use these scalars.
function scalars(node) {
    const values = [];
    let offset = 0;
    for (let i = 0; i < node.count; i++) {
        const type = String.fromCharCode(node.properties[offset++]);
        if (type === 'S') {
            const length = node.properties.readUInt32LE(offset);
            offset += 4;
            values.push(node.properties.subarray(offset, offset + length).toString('utf8'));
            offset += length;
        } else if (type === 'L') {
            values.push(node.properties.readBigInt64LE(offset));
            offset += 8;
        } else if (type === 'I') {
            values.push(node.properties.readInt32LE(offset));
            offset += 4;
        } else {
            throw new Error(`Unexpected scalar ${type} in ${node.name}`);
        }
    }
    assert.equal(offset, node.properties.length);
    return values;
}

function encodeNode(node, offset) {
    const name = Buffer.from(node.name, 'utf8');
    const header = Buffer.alloc(RECORD_SIZE);
    const chunks = [header, name, node.properties];
    let end = offset + RECORD_SIZE + name.length + node.properties.length;
    for (const child of node.children) {
        const encoded = encodeNode(child, end);
        chunks.push(encoded);
        end += encoded.length;
    }
    if (node.terminated) {
        chunks.push(Buffer.alloc(RECORD_SIZE));
        end += RECORD_SIZE;
    }
    header.writeBigUInt64LE(BigInt(end), 0);
    header.writeBigUInt64LE(BigInt(node.count), 8);
    header.writeBigUInt64LE(BigInt(node.properties.length), 16);
    header[24] = name.length;
    return Buffer.concat(chunks);
}

export function stripFbxTextures(buffer) {
    const fbx = readFbx(buffer);
    const objects = fbx.nodes.find(node => node.name === 'Objects');
    const connections = fbx.nodes.find(node => node.name === 'Connections');
    const definitions = fbx.nodes.find(node => node.name === 'Definitions');
    assert(objects && connections && definitions, 'Missing FBX sections');

    const removed = objects.children.filter(node => TEXTURE_TYPES.has(node.name));
    const ids = new Set(removed.map(node => scalars(node)[0]));
    objects.children = objects.children.filter(node => !TEXTURE_TYPES.has(node.name));
    connections.children = connections.children.filter(node => {
        if (node.name !== 'C') return true;
        const [, from, to] = scalars(node);
        return !ids.has(from) && !ids.has(to);
    });

    let removedCount = 0;
    definitions.children = definitions.children.filter(node => {
        if (node.name !== 'ObjectType' || !TEXTURE_TYPES.has(scalars(node)[0])) return true;
        const count = node.children.find(child => child.name === 'Count');
        removedCount += scalars(count)[0];
        return false;
    });
    assert.equal(removedCount, removed.length, 'FBX texture definition counts differ');
    const count = definitions.children.find(node => node.name === 'Count');
    const remainingCount = scalars(count)[0] - removedCount;
    count.properties = Buffer.alloc(5);
    count.properties[0] = 'I'.charCodeAt(0);
    count.properties.writeInt32LE(remainingCount, 1);

    const chunks = [fbx.header];
    let offset = HEADER_SIZE;
    for (const node of fbx.nodes) {
        const encoded = encodeNode(node, offset);
        chunks.push(encoded);
        offset += encoded.length;
    }
    chunks.push(Buffer.alloc(RECORD_SIZE));
    offset += RECORD_SIZE;
    // Preserve the footer magic/version; realign its padding to the new file size.
    const padding = 16 - ((offset + 16) % 16);
    chunks.push(fbx.footer.subarray(0, 16), Buffer.alloc(padding), fbx.footer.subarray(-144));
    const result = Buffer.concat(chunks);
    assert.deepEqual(readFbx(result).nodes, fbx.nodes, 'FBX serialization changed retained records');
    return result;
}
