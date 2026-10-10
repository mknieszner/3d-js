import Experience from "../../Experiance.js";
import * as THREE from 'three';
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry.js";
import Scenario from "../../Scenario/Scenario.js";
import {NeonColors} from "../models/Actor.js";

export default class CongratulationsText {
    constructor() {
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.debug = this.experiance.debug;
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Congrats');
            this.debugFolder.close();
        }

        this.setGeometry();
        this.setTextures();
        this.setMaterial();
        this.setMesh();
        this.setModelLight();
        this.watchConfig();
    }

    setGeometry() {
        this.geometry = new TextGeometry('G r a t u l a c j e', {
            font: this.resources.items.kenpixel_ttf,
            size: 1,
            height: 5,
            curveSegments: 1,
            bevelEnabled: true,
            bevelThickness: 0.001,
            bevelSize: 0.001,
            bevelOffset: 0,
            bevelSegments: 1
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
        this.textures.color = this.resources.items.textureSilverRing;
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.anisotropy = 16
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
            opacity: 0.25,
            transparent: true
        });
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.z = -30
        this.scene.add(this.mesh)

        if(this.debug.active) {
            this.debugFolder.add(this.mesh.material, 'opacity')
                .name('mesh opacity')
                .min(0).max(10).step(0.001);
            this.debugFolder.add(this.mesh.position, 'x')
                .name('x')
                .min(-100).max(100).step(0.001);
            this.debugFolder.add(this.mesh.position, 'y')
                .name('y')
                .min(-100).max(100).step(0.001);
            this.debugFolder.add(this.mesh.position, 'z')
                .name('z')
                .min(-100).max(100).step(0.001);
        }
    }

    setModelLight() {
        this.modelLight = new THREE.SpotLight('#9900ff', 80)
        this.modelLight.position.set(5, 2, -37)
        this.modelLight.angle = Math.PI / 3;
        this.modelLight.penumbra = 1;
        this.modelLight.decay = 1;
        this.modelLight.distance = 10;
        this.scene.add(this.modelLight)

        this.modelLight2 = new THREE.SpotLight('#97c9da', 80)
        this.modelLight2.position.set(-5, 2, -37)
        this.modelLight2.angle = Math.PI / 3;
        this.modelLight2.penumbra = 1;
        this.modelLight2.decay = 1;
        this.modelLight2.distance = 10;


        this.scene.add(this.modelLight2)

        if (this.debug.active && this.modelLight) {
            this.debugFolder.add(this.modelLight, 'intensity')
                .name('modelLight  - intensity')
                .min(0).max(500).step(0.001)
            this.debugFolder.add(this.modelLight, 'distance')
                .name('modelLight  - distance')
                .min(-20).max(50).step(0.001)
            this.debugFolder.add(this.modelLight.position, 'x')
                .name('modelLight X')
                .min(-20).max(50).step(0.001)
            this.debugFolder.add(this.modelLight.position, 'y')
                .name('modelLight Y')
                .min(-20).max(50).step(0.001)
            this.debugFolder.add(this.modelLight.position, 'z')
                .name('modelLight Z')
                .min(-20).max(50).step(0.001)
            this.debugFolder.addColor(this.modelLight, 'color')
                .name('modelLight - color')
                .onChange((color) => this.modelLight.color = color);
            this.helper = new THREE.SpotLightHelper(this.modelLight)
            this.scene.add(this.helper)
        }

        if (this.debug.active && this.modelLight2) {
            this.debugFolder.add(this.modelLight2, 'intensity')
                .name('modelLight2  - intensity')
                .min(0).max(500).step(0.001)
            this.debugFolder.add(this.modelLight2, 'distance')
                .name('modelLight2  - distance')
                .min(-20).max(50).step(0.001)
            this.debugFolder.add(this.modelLight2.position, 'x')
                .name('modelLight2 X')
                .min(-20).max(50).step(0.001)
            this.debugFolder.add(this.modelLight2.position, 'y')
                .name('modelLight2 Y')
                .min(-20).max(50).step(0.001)
            this.debugFolder.add(this.modelLight2.position, 'z')
                .name('modelLight2 Z')
                .min(-20).max(50).step(0.001)
            this.debugFolder.addColor(this.modelLight2, 'color')
                .name('modelLight2 - color')
                .onChange((color) => this.modelLight2.color = color);
            this.helper2 = new THREE.SpotLightHelper(this.modelLight2)
            this.scene.add(this.helper2)
        }
    }

    watchConfig() {
        this.setConfig()
        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => this.setConfig())
    }

    setConfig() {
        this.targetScale = this.experiance.config.stage.texts?.congrats?.scale || 0;
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
        } else if (Math.abs(deltaX) > 0.0001 || Math.abs(deltaY) > 0.0001 || Math.abs(deltaZ) > 0.0001) {
            const stepScale = this.mesh.scale.x + deltaX * this.experiance.time.damping(1 / 15);
            this.mesh.scale.set(stepScale, stepScale, stepScale);
        }
    }
}
