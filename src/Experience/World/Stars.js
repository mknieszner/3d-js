import Experience from "../Experiance.js";
import * as THREE from 'three';

export default class Stars {
    stars = null

    constructor(texture, count, size, update) {
        this.experiance = Experience.INSTANCE;
        this.time = this.experiance.time;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.count = count;
        this.size = size;
        this.shouldUpdate = update;

        this.setGeometry(count);
        this.setTextures(texture);
        this.setMaterial();
        this.setMesh();
    }

    setGeometry(count) {
        this.geometry = new THREE.BufferGeometry();
        this.positions = this.generatePositions(count);
        this.velocities = Float64Array.from({length: count}, () => THREE.MathUtils.randInt(50, 200));
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
    }

    setTextures(texture) {
        this.textures = {}
        this.textures.color = this.resources.items[texture];
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.anisotropy = 16
    }

    setMaterial() {
        this.material = new THREE.PointsMaterial({
            size: this.size,
            color: "#ffffff",
            transparent: true,
            opacity: 0.8,
            map: this.textures.color,
            blending: THREE.AdditiveBlending
        });

        this.material.depthWrite = false;
    }

    setMesh() {
        this.stars = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.stars);
    }

    update() {
        if (!this.shouldUpdate) {
            return
        }
        const minRadius = 3;
        const positions = this.geometry.attributes.position.array;

        // One speed per star's flight, not a new random speed per rendered frame.
        // Process complete xyz triples and retain elapsed time across respawns.
        for (let star = 0; star < this.count; star++) {
            const i = star * 3;
            let remaining = this.time.frameScale;
            while (remaining > 0) {
                const decay = 1 - 1 / this.velocities[star];
                const distance = Math.max(Math.abs(positions[i]), Math.abs(positions[i + 2]));
                const untilRespawn = distance > minRadius ? Math.log(minRadius / distance) / Math.log(decay) : 0;
                const step = Math.min(remaining, untilRespawn);
                const factor = Math.pow(decay, step);
                positions[i] *= factor;
                positions[i + 1] *= factor;
                positions[i + 2] *= factor;
                remaining -= step;

                if (step === untilRespawn) {
                    const position = this.randomPointSphere(10);
                    positions.set([position.x, position.y, position.z], i);
                    this.velocities[star] = THREE.MathUtils.randInt(50, 200);
                }
            }
        }

        this.geometry.attributes.position.needsUpdate = true;
    }

    generatePositions(count) {
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count * 3; i += 3) {
            let particleStar = this.randomPointSphere(10);

            positions[i] = particleStar.x;
            positions[i + 1] = particleStar.y;
            positions[i + 2] = particleStar.z;
        }
        return positions;
    }

    randomPointSphere(radius) {
        let theta = 2 * Math.PI * Math.random();
        let phi = Math.acos(2 * Math.random() - 1);
        let dx = 0 + radius * Math.sin(phi) * Math.cos(theta);
        let dy = 0 + radius * Math.sin(phi) * Math.sin(theta);
        let dz = 0 + radius * Math.cos(phi);
        return new THREE.Vector3(dx, dy, dz);
    }
}
