import assert from 'node:assert/strict';
import test from 'node:test';
import {Group, Scene, Vector3} from 'three';
import '../src/Experience/Experiance.js';
import Satellite from '../src/Experience/World/satellite/Satellite.js';
import DefaultPlanet from '../src/Experience/World/planets/DefaultPlanet.js';
import EllipticalOrbit from '../src/Experience/World/EllipticalOrbit.js';
import {HISTORY_STEPS} from '../src/Experience/Scenario/HistoryScenario.js';

function capsule(name, page = 10) {
    const satellite = Object.assign(Object.create(Satellite.prototype), {
        configName: name, scene: new Scene(), group: new Group(), time: {elapsed: 0},
        experiance: {config: {stage: HISTORY_STEPS[page - 10]}},
    });
    satellite.setOrbit();
    satellite.setConfig();
    return satellite;
}

function orbitPoint(orbit, index) {
    orbit.updateMatrixWorld(true);
    return new Vector3().fromBufferAttribute(orbit.geometry.attributes.position, index)
        .applyMatrix4(orbit.matrixWorld);
}

function systemPlanet(orbitalElements = {}) {
    const time = {elapsed: 0, frameScale: 1, damping: alpha => alpha};
    const planet = Object.assign(Object.create(DefaultPlanet.prototype), {
        scene: new Scene(), group: new Group(), mesh: {rotation: {y: 0}},
        text: {text: 'Sys. X', color: 0xD38F5C, update() {}}, orbitRadius: 18, speed: 20,
        time, experiance: {time}, targetScale: 1,
    });
    planet.setOrbit(orbitalElements);
    return planet;
}

test('capsule orbit dots lie on the actual tilted flight path', () => {
    for (const [name, offset] of [['draco', 0], ['taurus', 1.5], ['aquarius', 3], ['gemini', 4.5]]) {
        const satellite = capsule(name);
        for (const index of [0, 7, 19, 35, 47]) {
            const point = orbitPoint(satellite.orbit, index);
            const angle = Math.atan2(point.z, point.x);
            satellite.time.elapsed = ((angle - Math.PI * 0.5 - offset + Math.PI * 4) % (Math.PI * 2))
                / (0.00005 * Math.PI);
            satellite.rotateAroundPosition(offset);
            assert(satellite.group.position.distanceTo(point) < 1e-6, `${name}: dot ${index}`);
        }
    }
});

test('shared capsule paths keep separate dots for every team color', () => {
    const satellites = ['draco', 'taurus', 'aquarius', 'gemini'].map(name => capsule(name));
    assert.equal(new Set(satellites.map(s => s.orbit.material.color.getHex())).size, 4);
    for (let a = 0; a < satellites.length; a++) {
        for (let b = a + 1; b < satellites.length; b++) {
            for (let i = 0; i < 48; i++) {
                for (let j = 0; j < 48; j++) {
                    assert(orbitPoint(satellites[a].orbit, i).distanceTo(orbitPoint(satellites[b].orbit, j)) > 0.05);
                }
            }
        }
    }
});

test('capsule orbits resize on chapter changes and hide in movie and stationary scenes', () => {
    const satellite = capsule('draco');
    const geometry = satellite.orbit.geometry;
    assert.equal(satellite.orbit.visible, true);
    for (const [page, visible, radius] of [[11, true, 5], [12, false, 4.5], [14, true, 4.5], [19, false, 1.2]]) {
        satellite.experiance.config.stage = HISTORY_STEPS[page - 10];
        satellite.setConfig();
        assert.equal(satellite.orbit.visible, visible, `page ${page}`);
        assert.equal(satellite.orbit.scale.x, radius, `page ${page}`);
        assert.equal(satellite.orbit.geometry, geometry);
    }
});

test('system planet orbits match the flight center, radius and label color', () => {
    const planet = systemPlanet();
    assert.equal(planet.orbit.material.color.getHex(), planet.text.color);
    for (const index of [0, 17, 49, 93, 127]) {
        const point = orbitPoint(planet.orbit, index);
        const angle = Math.atan2(-point.z, -(point.x - 1));
        planet.time.elapsed = ((angle + Math.PI * 2) % (Math.PI * 2)) / (0.00001 * planet.speed);
        planet.update();
        assert(planet.group.position.distanceTo(point) < 1e-6, `vertex ${index}`);
        assert.equal(planet.orbit.visible, true);
    }
    planet.targetScale = 0;
    planet.update();
    assert.equal(planet.orbit.visible, false);
});

test('inclined elliptical planet paths match every line vertex and keep chapter visibility', () => {
    for (const inclination of [-13, 17]) {
        const eccentricity = 0.12;
        const phase = 155;
        const planet = systemPlanet({eccentricity, inclination, ascendingNode: 105, periapsis: 110, phase});
        const geometry = planet.orbit.geometry;
        const vertexCount = geometry.attributes.position.count;
        let minHeight = Infinity;
        let maxHeight = -Infinity;
        for (let i = 0; i < vertexCount; i++) {
            const eccentricAnomaly = i * Math.PI * 2 / vertexCount;
            const meanAnomaly = eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly);
            const angle = (meanAnomaly - phase * Math.PI / 180 + Math.PI * 2) % (Math.PI * 2);
            planet.time.elapsed = angle / (0.00001 * planet.speed);
            planet.update();
            const point = orbitPoint(planet.orbit, i);
            assert(planet.group.position.distanceTo(point) < 2e-6, `inclination ${inclination}, vertex ${i}`);
            assert(Math.abs(point.distanceTo(planet.orbit.position)
                - planet.orbitRadius * (1 - eccentricity * Math.cos(eccentricAnomaly))) < 2e-6);
            minHeight = Math.min(minHeight, point.y);
            maxHeight = Math.max(maxHeight, point.y);
        }
        assert(minHeight < -2 && maxHeight > 2, 'The path must pass above and below the original plane');

        planet.targetScale = 0;
        for (let i = 0; i < 30; i++) planet.update();
        assert.equal(planet.orbit.visible, false);
        assert.equal(planet.group.visible, false);
        planet.targetScale = 1;
        planet.update();
        assert.equal(planet.orbit.visible, true);
        assert.equal(planet.group.visible, true);
        assert.equal(planet.orbit.geometry, geometry, 'Animation and chapter changes reuse orbit geometry');
    }
});

test('elliptical motion speeds up near the focus and repeats without a jump', () => {
    const eccentricity = 0.12;
    const path = new EllipticalOrbit({eccentricity, inclination: 17, ascendingNode: 175, periapsis: 225});
    const point = angle => path.getPosition(angle, new Vector3());
    assert(Math.abs(point(0).length() - (1 - eccentricity)) < 1e-10);
    assert(Math.abs(point(Math.PI).length() - (1 + eccentricity)) < 1e-10);
    const step = 0.0001;
    const nearSpeed = point(step).distanceTo(point(-step));
    const farSpeed = point(Math.PI + step).distanceTo(point(Math.PI - step));
    assert(Math.abs(nearSpeed / farSpeed - (1 + eccentricity) / (1 - eccentricity)) < 1e-7);
    for (const angle of [-step, 0, step, 1.2, Math.PI]) {
        assert(point(angle).distanceTo(point(angle + Math.PI * 2 * 1000)) < 1e-10);
    }
});

test('inclined planet animation reaches the same position at different frame rates', () => {
    let reference;
    for (const fps of [30, 60, 144]) {
        const planet = systemPlanet({eccentricity: 0.08, inclination: 9, ascendingNode: 25, periapsis: 30, phase: 25});
        for (let frame = 1; frame <= fps * 4; frame++) {
            planet.time.elapsed = frame * 1000 / fps;
            planet.time.frameScale = 60 / fps;
            planet.update();
        }
        reference ||= {position: planet.group.position.clone(), rotation: planet.mesh.rotation.y};
        assert(planet.group.position.distanceTo(reference.position) < 1e-10);
        assert(Math.abs(planet.mesh.rotation.y - reference.rotation) < 1e-10);
    }
});
