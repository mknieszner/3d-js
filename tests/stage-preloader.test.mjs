import assert from 'node:assert/strict';
import test from 'node:test';
import {BufferGeometry} from 'three';
import GeometryCache, {textGeometryKey} from '../src/Experience/Utils/GeometryCache.js';
import StagePreloader from '../src/Experience/Utils/StagePreloader.js';
import EventEmitter from '../src/Experience/Utils/EventEmmiter.js';
import DisposeUtils from '../src/Experience/Utils/Dispose.js';
import {Group, Mesh, MeshBasicMaterial, Texture} from 'three';
import Scores from '../src/Experience/World/scores/Scores.js';
import Renderer from '../src/Experience/Renderer.js';
import {Scene} from 'three';

function fixture() {
    const config = Object.assign(new EventEmitter(), {
        step: 2,
        steps: Array.from({length: 8}, (_, index) => ({
            description: {content: [`stage ${index}`]}, texts: {},
        })),
    });
    const cache = new GeometryCache();
    const generated = [];
    const description = {
        firstBig: true,
        generateGeometry(line, big) {
            return cache.get(textGeometryKey('description', line, big ? 1 : 0.6), () => {
                generated.push(line);
                return new BufferGeometry();
            });
        },
    };
    const experience = {config, resources: {geometryCache: cache}};
    return {preloader: new StagePreloader(experience, description), config, cache, generated};
}

test('preparation covers two upcoming stages and one previous stage, and bounds the cache', async () => {
    const {preloader, config, cache, generated} = fixture();
    await preloader.prepare();
    assert.deepEqual(generated, ['stage 2', 'stage 3', 'stage 4', 'stage 1']);
    const active = cache.items.get(textGeometryKey('description', 'stage 2', 1));
    let disposed = 0;
    active.addEventListener('dispose', () => disposed++);
    await preloader.prepare();
    assert.equal(generated.length, 4);
    config.step = 5;
    await preloader.prepare();
    assert.equal(disposed, 1);
    assert.equal(cache.items.size, 4);
    assert.deepEqual(generated.slice(4), ['stage 5', 'stage 6', 'stage 7']);
    preloader.destroy();
});

test('rapid navigation cancels stale queued work, and destroy cancels pending preparation', async () => {
    const originalIdle = globalThis.requestIdleCallback;
    const turns = [];
    globalThis.requestIdleCallback = callback => turns.push(callback);
    try {
        const {preloader, config, generated} = fixture();
        const old = preloader.prepare();
        config.step = 7;
        const current = preloader.prepare();
        turns.shift()();
        await old;
        assert.deepEqual(generated, []);
        turns.shift()();
        await Promise.resolve();
        assert.deepEqual(generated, ['stage 7']);
        turns.shift()();
        await current;
        assert.deepEqual(generated, ['stage 7', 'stage 6']);
        config.step = 0;
        const pending = preloader.prepare();
        preloader.destroy();
        turns.shift()();
        await pending;
        assert.deepEqual(generated, ['stage 7', 'stage 6']);
        assert.equal(config.callbacks.preloader, undefined);
    } finally {
        if (originalIdle === undefined) delete globalThis.requestIdleCallback;
        else globalThis.requestIdleCallback = originalIdle;
    }
});

test('mesh removal keeps shared cached geometry and textures alive until cache eviction', () => {
    const cache = new GeometryCache();
    const geometry = cache.get('shared', () => new BufferGeometry());
    assert.equal(cache.get('shared', () => assert.fail('geometry rebuilt')), geometry);
    let disposals = 0;
    geometry.addEventListener('dispose', () => disposals++);
    const texture = new Texture();
    let textureDisposals = 0;
    texture.addEventListener('dispose', () => textureDisposals++);
    const material = new MeshBasicMaterial({map: texture});
    const group = new Group();
    const mesh = new Mesh(geometry, material);
    group.add(mesh);
    DisposeUtils.dispose(mesh);
    assert.equal(group.children.length, 0);
    assert.equal(disposals, 0);
    assert.equal(textureDisposals, 0);
    cache.dispose();
    assert.equal(disposals, 1);
    material.dispose();
    texture.dispose();
});

test('unchanged score configuration does not rebuild panels or graphs', () => {
    const scores = Object.assign(Object.create(Scores.prototype), {
        items: [{}],
        experiance: {config: {stage: {texts: {scores: {scale: 1, data1: {title: 'Title'}}}}}},
        builds: 0,
        setMeshes() { this.builds++; },
    });
    scores.setConfig();
    scores.setConfig();
    assert.equal(scores.builds, 1);
    scores.experiance.config.stage.texts.scores = undefined;
    scores.setConfig();
    scores.setConfig();
    assert.equal(scores.builds, 2);
});

test('preparation uploads future text buffers, and restores the render target even on failure', async () => {
    const {preloader, generated} = fixture();
    const uploaded = [];
    preloader.experience.renderer = {prepareGeometry: geometry => uploaded.push(geometry)};
    await preloader.prepare();
    assert.equal(uploaded.length, generated.length);

    const targets = [];
    const previousTarget = {};
    const renderer = Object.assign(Object.create(Renderer.prototype), {
        preparationScene: new Scene(), preparationTarget: {},
        preparationMaterial: new MeshBasicMaterial(), camera: {instance: {}},
        instance: {
            getRenderTarget: () => previousTarget,
            setRenderTarget: target => targets.push(target),
            render() { throw new Error('GPU error'); },
        },
    });
    assert.throws(() => renderer.prepareGeometry(uploaded[0]), /GPU error/);
    assert.deepEqual(targets, [renderer.preparationTarget, previousTarget]);
    assert.equal(renderer.preparationScene.children.length, 0);
    renderer.preparationMaterial.dispose();
    preloader.destroy();
});
