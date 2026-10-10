import Experience from "../../Experiance.js";
import * as THREE from 'three';
import Scenario from "../../Scenario/Scenario.js";

export default class Astros {
    minTarget = 0;
    stars = null

    constructor(texture, count, source, color, size) {
        this.source = source;
        this.color = color;
        this.size = size;
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.time = this.experiance.time;
        this.lastSpawnTime = this.time.elapsed;
        this.count = count;

        this.setGeometry(count);
        this.setTextures(texture);
        this.setMaterial();
        this.setMesh();

        this.watchConfig();
    }

    setGeometry(count) {
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(count * 3);
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
    }

    setTextures(texture) {
        this.textures = {}
        this.textures.color = this.resources.items[texture];
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.anisotropy = 16
        this.textures.alpha = this.resources.items.textureAstroAlpha;
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.anisotropy = 16
    }

    setMaterial() {
        this.material = new THREE.PointsMaterial({
            size: 2,
            color: this.color,
            map: this.textures.color,
            transparent: true,
            alphaMap: this.textures.alpha
        });

        this.material.depthWrite = false;
    }

    setMesh() {
        this.stars = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.stars);
    }

    watchConfig() {
        this.setConfig()
        this.setPositions();
        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => this.setConfig())
    }

    setConfig() {
        this.minTarget = this.experiance.config.stage.missiles.minTarget;
        const scale = this.experiance.config.stage.missiles.scale;

        this.stars.scale.set(scale, scale, scale);
        this.stars.visible = !!scale;
    }

    update() {
        if (!this.source?.group?.position) {
            return
        }

        this.setPositions();
    }

    setPositions() {
        const positions = this.geometry.attributes.position.array;
        const newPositions = this.getNewPositions(positions, this.source?.group?.position)

        this.geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3))
    }

    getNewPositions(oldPositions, sourcePosition) {
        let result = this.updatePositions(oldPositions);
        const interval = 800;
        while (this.time.elapsed - this.lastSpawnTime >= interval - 1e-6) {
            this.lastSpawnTime += interval;
            // A spawn can fall between frames. Advance the new particle only
            // by its age, and keep the 800 ms cadence instead of resetting it.
            const age = Math.max(0, this.time.elapsed - this.lastSpawnTime);
            const decay = Math.pow(0.995, age * 60 / 1000);
            result = this.addPosition(result, {
                x: sourcePosition.x * decay,
                y: sourcePosition.y * decay,
                z: sourcePosition.z * decay
            });
        }

        return new Float32Array(result);
    }

    addPosition(positions, position) {
        return [...positions, position.x, position.y, position.z];
    }


    updatePositions(positions) {
        const decay = Math.pow(0.995, this.time.frameScale);
        return positions
            .filter((position, ndx) => this.shouldShow(positions, ndx))
            .map((position) => position * decay)
    }

    shouldShow(positions, ndx) {
        const nearestX = this.getNearestX(ndx);
        return Math.abs(positions[nearestX]) > this.minTarget
            && Math.abs(positions[nearestX + 1]) > this.minTarget
            && Math.abs(positions[nearestX + 2]) > this.minTarget
    }

    getNearestX(ndx) {
        if (ndx - 2 < 0 || ndx - 1 < 0) {
            return 0;
        }
        if ((ndx - 2) % 3 === 0) {
            return ndx - 2;
        }
        if ((ndx - 1) % 3 === 0) {
            return ndx - 1;
        }
        return ndx;
    }
}
