import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {Texture, TextureLoader} from 'three';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
import sharp from 'sharp';
import {stripFbxTextures} from './strip-fbx-textures.mjs';
import {textureSettings} from './texture-settings.mjs';
import sources from '../src/Experience/sources.js';

const root = fileURLToPath(new URL('../', import.meta.url));
let imageRequests = 0;
// FBXLoader normally creates browser image elements. Count those calls instead.
globalThis.window = {URL: {createObjectURL: () => 'blob:validation'}};
TextureLoader.prototype.load = function () {
    imageRequests++;
    return new Texture();
};

function digest(array) {
    return createHash('sha256').update(Buffer.from(array.buffer, array.byteOffset, array.byteLength)).digest('hex');
}

function geometryData(geometry) {
    if (!geometry) return null;
    const attributes = attrs => Object.fromEntries(Object.entries(attrs).map(([name, value]) => [name, {
        itemSize: value.itemSize, normalized: value.normalized, array: digest(value.array),
    }]));
    return {
        attributes: attributes(geometry.attributes),
        index: geometry.index && digest(geometry.index.array),
        groups: geometry.groups,
        morphAttributes: Object.fromEntries(Object.entries(geometry.morphAttributes)
            .map(([name, values]) => [name, values.map(value => digest(value.array))])),
    };
}

function modelData(model) {
    const nodes = [];
    model.traverse(node => nodes.push({
        name: node.name,
        type: node.type,
        parent: node.parent?.name,
        position: node.position.toArray(),
        quaternion: node.quaternion.toArray(),
        scale: node.scale.toArray(),
        geometry: geometryData(node.geometry),
        bones: node.skeleton?.bones.map(bone => bone.name),
        inverses: node.skeleton?.boneInverses.map(matrix => matrix.toArray()),
        bindMatrix: node.bindMatrix?.toArray(),
        bindMatrixInverse: node.bindMatrixInverse?.toArray(),
    }));
    return {
        nodes,
        animations: model.animations.map(clip => ({
            name: clip.name, duration: clip.duration, blendMode: clip.blendMode,
            tracks: clip.tracks.map(track => ({
                name: track.name, type: track.ValueTypeName, interpolation: track.getInterpolation(),
                times: digest(track.times), values: digest(track.values),
            })),
        })),
    };
}

function parse(buffer) {
    return new FBXLoader().parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength), '');
}

for (const action of ['agony', 'argue', 'salute', 'victory', 'yelling']) {
    const path = `models/Zombie/zombie_${action}.fbx`;
    const original = await readFile(resolve(root, 'assets/originals', path));
    const optimized = await readFile(resolve(root, 'static', path));
    const before = modelData(parse(original));
    imageRequests = 0;
    const after = modelData(parse(optimized));
    assert.equal(imageRequests, 0, `Unexpected image requests: ${action}`);
    assert.deepEqual(after, before, `Geometry, skinning or animations changed: ${action}`);
    assert(stripFbxTextures(optimized).equals(optimized), `Texture stripping is not idempotent: ${action}`);
    console.log(`${action}: geometry, skeleton and ${after.animations.length} animation(s) unchanged; no image requests`);
}

for (const texture of textureSettings) {
    const original = await readFile(resolve(root, 'assets/originals', texture.source));
    const optimized = await readFile(resolve(root, 'static', texture.output));
    const originalMetadata = await sharp(original).metadata();
    const metadata = await sharp(optimized).metadata();
    const scale = Math.min(1, texture.size / Math.max(originalMetadata.width, originalMetadata.height));
    assert.equal(metadata.width, Math.round(originalMetadata.width * scale), texture.output);
    assert.equal(metadata.height, Math.round(originalMetadata.height * scale), texture.output);
    assert.equal(metadata.format, texture.format, texture.output);
    assert.equal(metadata.channels, originalMetadata.channels, texture.output);
    if (texture.format === 'png') assert.equal(metadata.isPalette, false, texture.output);
    assert(optimized.length < original.length, `No size reduction: ${texture.output}`);
}
for (const source of sources) {
    await readFile(resolve(root, 'static', source.path));
}
console.log(`All ${textureSettings.length} optimized textures have the expected dimensions and formats; resource paths exist.`);
