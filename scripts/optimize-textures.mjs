import {readFile, writeFile, unlink} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import sharp from 'sharp';
import {stripFbxTextures} from './strip-fbx-textures.mjs';
import {textureSettings} from './texture-settings.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const originals = resolve(root, 'assets/originals');
const output = resolve(root, 'static');
const mib = bytes => (bytes / 1024 / 1024).toFixed(2);
let before = 0;
let after = 0;

async function save(path, input, optimized) {
    if (optimized.length >= input.length) throw new Error(`No size reduction: ${path}`);
    await writeFile(resolve(output, path), optimized);
    before += input.length;
    after += optimized.length;
    console.log(`${path}: ${mib(input.length)} -> ${mib(optimized.length)} MiB`);
}

// Always regenerate from the versioned originals, never resize an earlier output.
for (const texture of textureSettings) {
    const input = await readFile(resolve(originals, texture.source));
    let image = sharp(input).resize({
        width: texture.size, height: texture.size,
        fit: 'inside', withoutEnlargement: true, kernel: 'lanczos3',
    });
    if (texture.format === 'webp') image = image.webp({quality: 85, effort: 6});
    else if (texture.format === 'jpeg') image = image.jpeg({quality: 85, mozjpeg: true});
    else image = image.png({compressionLevel: 9, adaptiveFiltering: true, palette: false});
    await save(texture.output, input, await image.toBuffer());
    // Replaced formats must not leave unused, large copies in the public build.
    if (texture.source !== texture.output) {
        await unlink(resolve(output, texture.source)).catch(error => {
            if (error.code !== 'ENOENT') throw error;
        });
    }
}

// Actor.js replaces every zombie material with its own untextured hologram.
// Remove image/texture objects and their connections, keeping meshes and clips intact.
for (const action of ['agony', 'argue', 'salute', 'victory', 'yelling']) {
    const path = `models/Zombie/zombie_${action}.fbx`;
    const input = await readFile(resolve(originals, path));
    await save(path, input, stripFbxTextures(input));
}

console.log(`Total: ${mib(before)} -> ${mib(after)} MiB (saved ${mib(before - after)} MiB)`);
