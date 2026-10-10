// Colour maps keep detail; data maps use lossless PNG after one resize.
export const textureSettings = [
    ...['Albedo', 'Normal', 'AO', 'Roughness', 'Metalness'].map(map => ({
        source: `textures/nucleus/main/T_skulls_17_${map}.png`,
        output: `textures/nucleus/main/T_skulls_17_${map}.${map === 'Albedo' ? 'webp' : 'png'}`,
        size: map === 'Albedo' ? 2048 : 1024,
        format: map === 'Albedo' ? 'webp' : 'png',
    })),
    ...[
        'textures/bg/nucleus/starred.jpg',
        'textures/bg/nucleus/starpink.jpg',
        'textures/bg/nucleus/staryellow.jpg',
        'textures/bg/textureMars.jpg',
        'textures/bg/textureIce.jpg',
        'textures/bg/textureMoon.jpg',
    ].map(source => ({source, output: source.replace(/\.jpg$/, '.webp'), size: 2048, format: 'webp'})),
    ...['material_baseColor.jpeg', 'ml.001_baseColor.jpeg'].map(name => ({
        source: `models/Capsule/Capsule7/textures/${name}`,
        output: `models/Capsule/Capsule7/textures/${name}`,
        size: 2048,
        format: 'jpeg',
    })),
    ...['baseColor', 'metallicRoughness'].map(map => ({
        source: `models/Capsule/Capsule2/textures/Material.003_${map}.png`,
        output: `models/Capsule/Capsule2/textures/Material.003_${map}.png`,
        size: 1024,
        format: 'png',
    })),
];
