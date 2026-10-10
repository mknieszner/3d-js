import Experience from "../../Experiance.js";
import * as THREE from 'three';
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry.js";
import Scenario from "../../Scenario/Scenario.js";

export default class CorpoText {
    constructor(z) {
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.setGeometry();
        this.setTextures();
        this.setMaterial();
        this.setMesh(z);
        this.watchConfig();
    }

    setGeometry() {
        this.geometry = new TextGeometry('CORPO PLATFORM', {
            font: this.resources.items.kenpixel_ttf,
            size: 0.6,
            height: 0.05,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        })
        this.geometry.computeBoundingBox()
        this.geometry.translate(
            -this.geometry.boundingBox.max.x * 0.5,
            -this.geometry.boundingBox.max.y * 0.5,
            -this.geometry.boundingBox.max.z * 0.5
        )
    }

    setTextures() {
        this.textures = {}
        this.textures.color = this.resources.items.textureRedRing;
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.anisotropy = 16
    }

    setMaterial() {
        this.material = new THREE.MeshBasicMaterial({
            map: this.textures.color
        })
    }

    setMesh(z) {
        const y = 7;
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.y = y
        this.mesh.position.z = z
        this.mesh.position.z = z
        this.mesh.scale.set(0, 0, 0);
        this.scene.add(this.mesh)
    }

    watchConfig() {
        this.setConfig()
        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => this.setConfig())
    }

    setConfig() {
        this.targetScale = this.experiance.config.stage.texts.corpo.scale;
    }


    update() {
        this.updateScale();
        this.mesh?.quaternion.copy(Experience.INSTANCE.camera.instance.quaternion);
    }

    updateScale() {
        const deltaX = this.targetScale - this.mesh.scale.x;
        const deltaY = this.targetScale - this.mesh.scale.y;
        const deltaZ = this.targetScale - this.mesh.scale.z;

        if (this.targetScale === 0 && this.mesh.scale.x <= 0.4) {
            this.mesh.scale.set(this.targetScale, this.targetScale, this.targetScale);
            this.mesh.visible = false;
        } else if (Math.abs(deltaX) > 0.0001 || Math.abs(deltaY) > 0.0001 || Math.abs(deltaZ) > 0.0001) {
            const stepScale = this.mesh.scale.x + deltaX * this.experiance.time.damping(1 / 15);
            this.mesh.scale.set(stepScale, stepScale, stepScale);
            this.mesh.visible = true;
        }
    }
}
