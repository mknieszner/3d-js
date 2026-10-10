import assert from 'node:assert/strict';
import test from 'node:test';
import {BufferAttribute, BufferGeometry, Object3D, Vector3} from 'three';
import Time from '../src/Experience/Utils/Time.js';
import '../src/Experience/Experiance.js';
import Camera from '../src/Experience/Camera.js';
import BgSphere from '../src/Experience/World/BgSphere.js';
import DefaultNucleus from '../src/Experience/World/nucleus/DefaultNucleus.js';
import PlanetShield from '../src/Experience/World/nucleus/PlanetShield.js';
import Guard from '../src/Experience/World/Guard.js';
import PlanetBase from '../src/Experience/World/planets/Models/Planet.js';
import PlanetProcessB from '../src/Experience/World/planets/Models/PlanetProcessB.js';
import DefaultText from '../src/Experience/World/texts/DefaultText.js';
import CorpoText from '../src/Experience/World/texts/CorpoText.js';
import ScoreModel from '../src/Experience/World/scores/ScoreModel.js';
import Actor from '../src/Experience/World/models/Actor.js';
import Stars from '../src/Experience/World/Stars.js';
import Astros from '../src/Experience/World/missels/Astros.js';
import Satellite from '../src/Experience/World/satellite/Satellite.js';

const rates = [30, 60, 75, 120, 144, 240];
const schedules = [...rates.map(rate => [1000 / rate]), [8, 23, 11, 42, 16, 7, 31]];

function simulate(schedule, duration, setup, update) {
    const time = Object.assign(Object.create(Time.prototype), {delta: 0, elapsed: 0});
    const state = setup(time);
    for (let frame = 0; time.elapsed < duration - 1e-8; frame++) {
        time.delta = Math.min(schedule[frame % schedule.length], duration - time.elapsed);
        time.elapsed += time.delta;
        update(state);
    }
    return state;
}

function fixture(Type, time, values = {}) {
    return Object.assign(Object.create(Type.prototype), {
        experiance: {time}, time, mesh: new Object3D(), group: new Object3D(), ...values,
    });
}

function close(actual, expected, tolerance = 1e-8) {
    assert.equal(actual.length, expected.length);
    actual.forEach((value, index) => {
        assert(Number.isFinite(value), `Non-finite value at ${index}`);
        assert(Math.abs(value - expected[index]) <= tolerance, `${value} != ${expected[index]}`);
    });
}

test('rotations and ring bounces cover the same distance at every refresh rate', () => {
    for (const schedule of schedules) {
        const state = simulate(schedule, 2000, time => {
            const ring = Object.assign(new Object3D(), {corpo_velicity: 0.3});
            return {
                bg: fixture(BgSphere, time), nucleus: fixture(DefaultNucleus, time, {nucleus: new Object3D()}),
                model: fixture(ScoreModel, time), actor: fixture(Actor, time, {targetActor: 'zombieVictory'}), ring,
                planet: fixture(PlanetProcessB, time, {updateScale() {}, updatePosition() {}}),
            };
        }, s => {
            s.bg.update(); s.nucleus.rotate(); s.model.update(); s.planet.update();
            s.actor.updateRing(s.ring, 0, {x: 8, y: -8.5, z: 5});
        });
        close([
            ...state.bg.mesh.rotation.toArray().slice(0, 3), state.nucleus.nucleus.rotation.y,
            state.model.group.rotation.y, state.planet.mesh.rotation.z, state.planet.mesh.rotation.y,
            ...state.ring.position.toArray(),
        ], [0.12, 0.12, 0.12, 0.72, 1.2, 0.24, 0.12, 8, 0, 6]);
    }
});

test('camera, scaling, positioning and opening transitions use elapsed time', () => {
    function run(schedule) {
        const state = simulate(schedule, 1000, time => {
            const nucleus = fixture(DefaultNucleus, time, {
                nucleus: new Object3D(), targetScale: 4, target: new Vector3(20, 30, 40), targetThetaLength: 1,
                updateGeometry(params) { Object.assign(this.nucleus.geometry.parameters, params); },
            });
            nucleus.nucleus.scale.setScalar(0);
            nucleus.nucleus.geometry = {parameters: {thetaLength: Math.PI}};
            const shield = fixture(PlanetShield, time, {targetScale: 4});
            const guard = fixture(Guard, time, {targetScale: 4});
            const text = fixture(DefaultText, time, {targetScale: 4});
            Object.defineProperty(text, 'scaleMesh', {value: text.mesh});
            const corpo = fixture(CorpoText, time, {targetScale: 4});
            const planet = fixture(PlanetBase, time, {targetScale: 4, targetPosition: {x: 20, y: 30, z: 40}});
            const camera = fixture(Camera, time, {
                instance: new Object3D(), targetPosition: {x: 80, y: 40, z: 20}, velocity: 0.03, updating: true,
            });
            camera.instance.updateProjectionMatrix = () => {};
            const follow = fixture(Camera, time, {instance: new Object3D()});
            follow.instance.updateProjectionMatrix = () => {};
            return {nucleus, shield, guard, text, corpo, planet, camera, follow};
        }, s => {
            s.nucleus.updateScale(); s.nucleus.updateTarget(); s.nucleus.updateThetaLength();
            s.shield.updateScale(); s.guard.updateScale(); s.text.updateScale(); s.corpo.updateScale();
            s.planet.updateScale(); s.planet.updatePosition(); s.camera.updatePosition();
            s.follow.followTarget({getWorldPosition(position) { position.set(50, 25, 10); }});
        });
        return [
            ...state.nucleus.nucleus.scale.toArray(), ...state.nucleus.group.position.toArray(),
            state.nucleus.nucleus.geometry.parameters.thetaLength,
            ...state.shield.mesh.scale.toArray(), ...state.guard.mesh.scale.toArray(),
            ...state.text.mesh.scale.toArray(), ...state.corpo.mesh.scale.toArray(),
            ...state.planet.group.scale.toArray(), ...state.planet.group.position.toArray(),
            ...state.camera.instance.position.toArray(), ...state.follow.instance.position.toArray(),
        ];
    }
    const reference = run([1000 / 60]);
    for (const schedule of schedules) close(run(schedule), reference);
});

test('star flight stays finite and preserves time when respawning', () => {
    const originalRandom = Math.random;
    Math.random = () => 0.5;
    try {
        const run = schedule => simulate(schedule, 4000, time => {
            const geometry = new BufferGeometry();
            geometry.setAttribute('position', new BufferAttribute(new Float32Array([10, 4, 7, -8, 3, -5]), 3));
            return fixture(Stars, time, {
                geometry, count: 2, shouldUpdate: true, velocities: new Float64Array([90, 150]),
                randomPointSphere() { return new Vector3(10, 4, 7); },
            });
        }, stars => stars.update()).geometry.attributes.position.array;
        const reference = Array.from(run([1000 / 60]));
        for (const schedule of schedules) close(Array.from(run(schedule)), reference, 0.0001);
    } finally {
        Math.random = originalRandom;
    }
});

test('missiles retain their 800 ms spawn cadence and travel speed', () => {
    const run = schedule => simulate(schedule, 4000, time => fixture(Astros, time, {
        minTarget: 0, lastSpawnTime: 0, positions: new Float32Array(),
    }), astros => {
        astros.positions = astros.getNewPositions(astros.positions, {x: 20, y: 8, z: 5});
    }).positions;
    const reference = Array.from(run([1000 / 60]));
    assert.equal(reference.length, 15, 'Five complete particles should spawn in four seconds');
    for (const schedule of schedules) close(Array.from(run(schedule)), reference, 0.0001);
});

test('stationary satellites use zero for optional offsets', () => {
    const satellite = fixture(Satellite, {}, {
        configName: 'draco', position: {x: 1, y: 2, z: 3}, updateRotationOverPlanet: false,
        experiance: {config: {stage: {satellite: {draco: {}}}}},
    });
    satellite.rotateAroundPosition(0);
    close(satellite.group.position.toArray(), [1, 2, 3]);
});

test('fast camera settings do not produce NaN on fractional frames', () => {
    const time = Object.assign(Object.create(Time.prototype), {delta: 1000 / 144});
    assert.equal(time.damping(2), 1);
    assert.equal(time.damping(0), 0);
    time.delta = 0;
    assert.equal(time.damping(1), 0);
});

test('clock skips hidden time, caps stalls and releases its animation callback', () => {
    const oldWindow = globalThis.window;
    const oldDocument = globalThis.document;
    let callback;
    let cancelled = false;
    globalThis.document = Object.assign(new EventTarget(), {hidden: false});
    globalThis.window = {
        requestAnimationFrame(fn) { callback = fn; return 42; },
        cancelAnimationFrame(id) { assert.equal(id, 42); cancelled = true; },
    };
    try {
        const time = new Time();
        callback(1000);
        assert.equal(time.delta, 0);
        callback(1010);
        assert.equal(time.elapsed, 10);
        document.hidden = true;
        document.dispatchEvent(new Event('visibilitychange'));
        callback(5000);
        assert.equal(time.elapsed, 10);
        document.hidden = false;
        document.dispatchEvent(new Event('visibilitychange'));
        callback(10000);
        assert.equal(time.delta, 0);
        callback(10020);
        assert.equal(time.elapsed, 30);
        callback(20000);
        assert.equal(time.delta, Time.MAX_DELTA);
        assert.equal(time.elapsed, 30 + Time.MAX_DELTA);
        time.destroy();
        assert(cancelled);
        document.dispatchEvent(new Event('visibilitychange'));
        assert.equal(time.current, 20000, 'Visibility listener must be removed');
    } finally {
        globalThis.window = oldWindow;
        globalThis.document = oldDocument;
    }
});
