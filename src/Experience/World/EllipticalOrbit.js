import {MathUtils, Quaternion, Vector3} from 'three';

const FULL_TURN = Math.PI * 2;

export default class EllipticalOrbit {
    // Orbital angles are supplied in degrees; anomalies used for sampling are radians.
    constructor({eccentricity = 0, inclination = 0, ascendingNode = 0, periapsis = 0, phase = 0} = {}) {
        if (!Number.isFinite(eccentricity) || eccentricity < 0 || eccentricity >= 1) {
            throw new RangeError('Elliptical orbit eccentricity must be between 0 (inclusive) and 1 (exclusive).');
        }
        this.eccentricity = eccentricity;
        this.minorAxis = Math.sqrt(1 - eccentricity * eccentricity);
        this.phase = MathUtils.degToRad(phase);

        const up = new Vector3(0, 1, 0);
        this.orientation = new Quaternion()
            .setFromAxisAngle(up, MathUtils.degToRad(ascendingNode))
            .multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), MathUtils.degToRad(inclination)))
            .multiply(new Quaternion().setFromAxisAngle(up, MathUtils.degToRad(periapsis)));
    }

    getPoint(eccentricAnomaly, target) {
        // Unit semi-major axis, with the central body at a focus of the ellipse.
        return target.set(
            Math.cos(eccentricAnomaly) - this.eccentricity,
            0,
            this.minorAxis * Math.sin(eccentricAnomaly)
        ).applyQuaternion(this.orientation);
    }

    getPosition(meanAnomaly, target) {
        const mean = ((meanAnomaly + this.phase) % FULL_TURN + FULL_TURN) % FULL_TURN;
        let eccentricAnomaly = this.eccentricity < 0.8 ? mean : Math.PI;
        // Solve Kepler's equation: equal time steps sweep equal areas around the focus.
        for (let i = 0; i < 10; i++) {
            const correction = (eccentricAnomaly - this.eccentricity * Math.sin(eccentricAnomaly) - mean)
                / (1 - this.eccentricity * Math.cos(eccentricAnomaly));
            eccentricAnomaly -= correction;
            if (Math.abs(correction) < 1e-10) break;
        }
        return this.getPoint(eccentricAnomaly, target);
    }
}
