import Experience from "../../Experiance.js";
import * as THREE from "three";
import Mouse from "../../Utils/Mouse.js";
import Scenario from "../../Scenario/Scenario.js";

export default class DefaultNucleus {
    noise = new SimplexNoise();
    blobScale = 0.1;
    material = null;
    configName = null;

    constructor() {
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.mouse = this.experiance.mouse;
        this.raycaster = this.experiance.raycaster;
        this.debug = this.experiance.debug;
    }

    setGeometry(segments = 32) {
        this.geometry = new THREE.SphereGeometry(1, segments, segments);
    }

    setTextures(textureName) {
        this.textures = {}
        this.textures.color = this.resources.items[textureName];
        this.textures.color.colorSpace = THREE.SRGBColorSpace

        this.textures.anisotropy = 16
    }

    setMaterial() {
        this.material = new THREE.MeshBasicMaterial({
            map: this.textures.color
        });
    }

    setMesh() {
        this.nucleus = new THREE.Mesh(this.geometry, this.material);
        this.nucleus.scale.set(0, 0, 0);
    }

    update() {
        this.setNoise();
        this.rotate();
        this.updateScale();
        this.updateTarget();
        this.updateTexture();
        this.updateThetaLength();
    }

    setNoise() {
        const positionAttribute = this.geometry.getAttribute('position');
        const vector = new THREE.Vector3();
        const time = this.experiance.time.elapsed;
        for (let vertexIndex = 0; vertexIndex < positionAttribute.count; vertexIndex++) {
            vector.fromBufferAttribute(positionAttribute, vertexIndex);
            vector.normalize();
            let distance = this.geometry.parameters.radius + this.noise.noise3D(
                vector.x + time * 0.0005,
                vector.y + time * 0.0003,
                vector.z + time * 0.0008
            ) * this.blobScale;

            vector.multiplyScalar(distance)

            positionAttribute.setXYZ(vertexIndex, vector.x, vector.y, vector.z);
        }
        positionAttribute.needsUpdate = true;
    }

    rotate() {
        this.nucleus.rotation.y += 0.006 * this.experiance.time.frameScale;
    }

    watchClicked() {

    }

    scaleOnClicked(min = 1, max = 2) {
        this.mouse.on(Mouse.LEFT_ClICK_EVENT, () => {
            if (this.hovered) {
                this.targetScale = max;
            }
        })
        this.mouse.on(Mouse.RIGHT_ClICK_EVENT, () => {
            if (this.hovered) {
                this.targetScale = min;
            }
        })
    }

    updateScale() {
        const damping = this.experiance.time.damping(1 / 20);
        const deltaX = this.targetScale - this.nucleus.scale.x;
        const deltaY = this.targetScale - this.nucleus.scale.y;
        const deltaZ = this.targetScale - this.nucleus.scale.z;

        if (Math.abs(deltaX) > 0.001 || Math.abs(deltaY) > 0.001 || Math.abs(deltaZ) > 0.001) {
            this.nucleus.scale.set(
                this.nucleus.scale.x + deltaX * damping,
                this.nucleus.scale.y + deltaY * damping,
                this.nucleus.scale.z + deltaZ * damping
            )
        } else {
            this.nucleus.scale.setScalar(this.targetScale);
        }

        if (this.group && this.targetScale && this.group.visible !== true) {
            this.group.visible = true;
        }

        if (this.group && !this.targetScale && Math.abs(deltaX) <= 0.001 && this.group.visible !== false) {
            this.group.visible = false;
        }
    }

    updateTarget() {
        const damping = this.experiance.time.damping(1 / 20);
        if (!this.group?.position || !this.target) {
            return
        }
        const deltaX = this.target.x - this.group.position.x;
        const deltaY = this.target.y - this.group.position.y;
        const deltaZ = this.target.z - this.group.position.z;
        if (deltaX || deltaY || deltaZ) {
            this.group.position.set(
                this.group.position.x + deltaX * damping,
                this.group.position.y + deltaY * damping,
                this.group.position.z + deltaZ * damping
            )
        }
    }

    updateThetaLength() {
        if (!this.nucleus?.geometry?.parameters?.thetaLength || this.targetThetaLength === undefined) {
            return;
        }

        const distance = this.nucleus.geometry.parameters.thetaLength - this.targetThetaLength;

        if (Math.abs(distance) <= 0.1) {
            return;
        }

        const updatedThetaLength = this.nucleus.geometry.parameters.thetaLength - distance * this.experiance.time.damping(1 / 100);

        this.updateGeometry({thetaLength: updatedThetaLength})
    }

    updateGeometry(newParams) {
        const params = {
            ...this.nucleus.geometry.parameters,
            ...newParams,
        }
        this.nucleus.geometry = new THREE.SphereGeometry(
            1,
            32,
            32,
            params.phiStart,
            params.phiLength,
            params.thetaStart,
            params.thetaLength
        );
    }

    updateTexture() {
        if (this.hovered) {
            this.material.map = this.textures.inside
        }

        if (!this.hovered) {
            this.material.map = this.textures.color
        }
    }


    get hovered() {
        return this.raycaster.intersects.some(intersect => intersect.object.uuid === this.nucleus.uuid)
    }

    watchConfig() {
        this.setConfig()
        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => this.setConfig())
    }

    setConfig() {
        this.target = new THREE.Vector3(
            this.experiance.config.stage.nucleus[this.configName].position.x,
            this.experiance.config.stage.nucleus[this.configName].position.y,
            this.experiance.config.stage.nucleus[this.configName].position.z
        );

        this.targetScale = this.experiance.config.stage.nucleus[this.configName].scale;
        this.targetThetaLength = this.experiance.config.stage.nucleus.thetaLength === undefined
            ? Math.PI
            : this.experiance.config.stage.nucleus.thetaLength;
        this.setInsideTexture(this.configName);
    }

    setInsideTexture(config) {
        this.textures.inside = this.resources.items[this.experiance.config.stage.nucleus[config].insideTexture];
        this.textures.inside.colorSpace = THREE.SRGBColorSpace
    }


    setDebug() {
        if (!this.debug.active || !this.configName) {
            return;
        }


        if (!this.debugFolder) {
            this.debugFolder = this.debug.ui.addFolder(this.configName + 'nucleus');
            this.debugFolder.close();
        }

        if (this.debug.active && this.nucleus.geometry && this.debug) {
            this.debugFolder.add(this.nucleus.geometry.parameters, 'phiStart')
                .name('nucleus  - phiStart')
                .min(0).max(Math.PI * 2).step(0.001)
                .onChange((phiStart) => this.updateGeometry({phiStart}));
            this.debugFolder.add(this.nucleus.geometry.parameters, 'phiLength')
                .name('nucleus  - phiLength')
                .min(0).max(Math.PI * 2).step(0.001)
                .onChange((phiLength) => this.updateGeometry({phiLength}));
            this.debugFolder.add(this.nucleus.geometry.parameters, 'thetaStart')
                .name('nucleus  - thetaStart')
                .min(0).max(Math.PI * 2).step(0.001)
                .onChange((thetaStart) => this.updateGeometry({thetaStart}));
            this.debugFolder.add(this.nucleus.geometry.parameters, 'thetaLength')
                .name('nucleus  - thetaLength')
                .min(0).max(Math.PI * 2).step(0.001)
                .onChange((thetaLength) => this.updateGeometry({thetaLength}));
        }
    }

    updateTextPosition(textMeshes, z = 0.6) {
        if (textMeshes?.length && this.nucleus?.geometry?.parameters?.radius) {
            textMeshes.forEach(textMesh => {
                textMesh.position.z = this.nucleus.geometry.parameters.radius + z;
            })
        }
    }
}
