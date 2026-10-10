import assert from 'node:assert/strict';
import test from 'node:test';
import {Object3D, PerspectiveCamera} from 'three';
import '../src/Experience/Experiance.js';
import Camera from '../src/Experience/Camera.js';

function cameraAt(search) {
    const originalWindow = globalThis.window;
    globalThis.window = {location: {search}};
    try {
        const canvas = Object.assign(new EventTarget(), {
            style: {}, clientWidth: 1280, clientHeight: 720,
            setPointerCapture() {}, releasePointerCapture() {},
        });
        const instance = new PerspectiveCamera(35, 1280 / 720, 0.1, 1000);
        instance.position.set(0, 0, 20);
        const camera = Object.assign(Object.create(Camera.prototype), {
            instance, canvas, updating: false, locked: false, targetItem: null,
            time: {elapsed: 0, damping: alpha => alpha},
        });
        camera.setOrbitControls();
        return camera;
    } finally {
        if (originalWindow === undefined) delete globalThis.window;
        else globalThis.window = originalWindow;
    }
}

function drag(camera, button = 0, pointerType = 'mouse') {
    for (const [type, x, y] of [['pointerdown', 600, 350], ['pointermove', 850, 450], ['pointerup', 850, 450]]) {
        camera.canvas.dispatchEvent(Object.assign(new Event(type, {cancelable: true}), {
            button, pointerType, pointerId: 1, clientX: x, clientY: y, pageX: x, pageY: y,
        }));
    }
    camera.update();
}

function zoom(camera) {
    camera.canvas.dispatchEvent(Object.assign(new Event('wheel', {cancelable: true}), {deltaY: -100}));
    camera.update();
}

test('manual camera gestures are blocked unless the URL explicitly has controls=true', () => {
    for (const search of ['', '?controls=false', '?controls=', '?controls=1', '?controls=TRUE']) {
        const camera = cameraAt(search);
        const position = camera.instance.position.clone();
        const rotation = camera.instance.quaternion.clone();
        drag(camera);
        drag(camera, 2);
        drag(camera, 0, 'touch');
        zoom(camera);
        assert(camera.instance.position.distanceTo(position) < 1e-10, search);
        assert(camera.instance.quaternion.angleTo(rotation) < 1e-7, search);
        assert.equal(camera.controls.target.length(), 0, search);
        camera.controls.dispose();
    }
});

test('controls=true enables mouse and touch rotation, panning and zooming', () => {
    for (const gesture of [camera => drag(camera), camera => drag(camera, 2), camera => drag(camera, 0, 'touch'), zoom]) {
        const camera = cameraAt('?page=10&controls=true');
        const position = camera.instance.position.clone();
        gesture(camera);
        assert(camera.instance.position.distanceTo(position) > 0.01);
        camera.controls.dispose();
    }
    const camera = cameraAt('?controls=true');
    const target = new Object3D();
    camera.setTarget(target);
    assert.equal(camera.targetItem, target);
    camera.clearTarget();
    assert.equal(camera.targetItem, null);
    camera.controls.dispose();
});

test('disabled manual controls still allow scripted camera transitions', () => {
    const camera = cameraAt('');
    camera.experience = {config: {stage: {camera: {position: {x: 10, y: 2, z: 30}, velocity: 0.3}}}};
    camera.setConfig();
    camera.setTarget(new Object3D());
    assert.equal(camera.targetItem, null);
    camera.clearTarget();
    assert.equal(camera.updating, true);
    camera.update();
    assert(Math.abs(camera.instance.position.x - 3) < 1e-10);
    assert(Math.abs(camera.instance.position.y - 0.6) < 1e-10);
    assert(Math.abs(camera.instance.position.z - 23) < 1e-10);
    assert.equal(camera.controls.enabled, false);
    camera.controls.dispose();
});
