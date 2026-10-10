import Experience from "../../Experiance.js";
import Scenario from "../../Scenario/Scenario.js";
import * as THREE from 'three';
import {NeonColors} from "../models/Actor.js";

export default class ScoreModel {
    items = []

    constructor() {
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.camera = this.experiance.camera;
        this.debug = this.experiance.debug;
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('nike');
            this.debugFolder.close();
        }
        this.setMaterial();
        this.group = new THREE.Group();
        this.setMeshes();
        this.setModelLight();
        this.scene.add(this.group);
        this.watchConfig();
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            color: NeonColors.DEFAULT.MAIN,
            opacity: 0.1,
            transparent: true,
            side: THREE.TwoPassDoubleSide
        });
    }

    setMeshes() {
        this.mesh = this.resources.items.nike.scene.children[0].children[0];

        this.mesh.scale.set(0.1, 0.1, 0.1);
        this.mesh.position.set(-9, -6.5, 8);
        this.mesh.rotation.x = -Math.PI / 2;
        this.group.add(this.mesh);

        this.mesh.traverse((child) => {
            if (child.material && !child.corpo_wireframe) {
                child.material = this.material;
                child.corpo_bloomed = true;
            }
        });

        if (this.debug.active) {
            this.debugFolder.add(this.mesh.position, 'x')
                .name('position X')
            this.debugFolder.add(this.mesh.position, 'y')
                .name('position X')
                .min(-20).max(20).step(0.001)
            this.debugFolder.add(this.mesh.position, 'z')
                .name('position Z')
                .min(-20).max(20).step(0.001)
            this.debugFolder.add(this.mesh.children[0].material, 'opacity')
                .name('opacity')
                .min(0).max(1).step(0.001).onChange(opacity => {
                this.mesh.traverse((child) => {
                    if (child.material) {
                        child.material.opacity = opacity
                    }
                });
            })
        }

    }

    setModelLight() {
        this.modelLight = new THREE.SpotLight('#9900ff', 150)
        this.modelLight.position.set(1, 9, 1)
        this.modelLight.angle = Math.PI / 3;
        this.modelLight.penumbra = 1;
        this.modelLight.decay = 1;
        this.modelLight.distance = 11;

        this.group.add(this.modelLight)

        if (this.debug.active && this.modelLight) {
            this.debugFolder.add(this.modelLight, 'intensity')
                .name('modelLight  - intensity')
                .min(0).max(500).step(0.001)
            this.debugFolder.add(this.modelLight, 'distance')
                .name('modelLight  - distance')
                .min(-20).max(20).step(0.001)
            this.debugFolder.add(this.modelLight.position, 'x')
                .name('modelLight X')
                .min(-20).max(20).step(0.001)
            this.debugFolder.add(this.modelLight.position, 'y')
                .name('modelLight Y')
                .min(-20).max(20).step(0.001)
            this.debugFolder.add(this.modelLight.position, 'z')
                .name('modelLight Z')
                .min(-20).max(20).step(0.001)
            this.debugFolder.addColor(this.modelLight, 'color')
                .name('modelLight - color')
                .onChange((color) => this.modelLight.color = color);
            this.helper = new THREE.SpotLightHelper(this.modelLight)
            this.scene.add(this.helper)
        }
    }

    watchConfig() {
        this.setConfig()
        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => this.setConfig())
    }

    setConfig() {
        const scale = this.experiance.config.stage.texts?.scores?.scale || 0;
        this.group.traverse(child => {
          if(child.isMesh || child.isLight) {
              child.visible = !!scale
          }
        })
    }


    update() {
        this.group.rotation.y += 0.01 * this.experiance.time.frameScale
    }
}
