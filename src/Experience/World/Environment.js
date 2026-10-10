import * as THREE from 'three';
import Experience from "../Experiance.js";
import Scenario from "../Scenario/Scenario.js";

export default class Environment {
    constructor() {
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.debug = this.experiance.debug;
        this.config = this.experiance.config;
        this.experiance.environment = this;

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('environment');
            this.debugFolder.close();
        }

        this.setSunLight();
        this.setAmbientLight();
        this.setEnvironmentMap();
        this.watchConfig();
    }

    setSunLight() {
        this.sunLight = new THREE.SpotLight('#ffffff', 100)
        this.sunLight.position.set(0, 8, 0)
        this.sunLight.angle = Math.PI / 3;
        this.sunLight.penumbra = 1;
        this.sunLight.decay = 1;
        this.sunLight.distance = 8;

        this.sunLight2 = new THREE.SpotLight('#ffffff', 100)
        this.sunLight2.position.set(0, -8, 0)
        this.sunLight2.angle = Math.PI / 3;
        this.sunLight2.penumbra = 1;
        this.sunLight2.decay = 1;
        this.sunLight2.distance = 8;

        this.scene.add(this.sunLight)
        this.scene.add(this.sunLight2)

        if (this.debug.active && this.sunLight && this.sunLight2) {
            this.debugFolder.add(this.sunLight, 'intensity')
                .name('sunLight  - intensity')
                .min(0).max(500).step(0.001)
            this.debugFolder.add(this.sunLight, 'distance')
                .name('sunLight  - distance')
                .min(0).max(20).step(0.001)
            this.debugFolder.add(this.sunLight.position, 'x')
                .name('sunLight X')
                .min(-20).max(20).step(0.001)
            this.debugFolder.add(this.sunLight.position, 'y')
                .name('sunLight Y')
                .min(-20).max(20).step(0.001)
            this.debugFolder.add(this.sunLight.position, 'z')
                .name('sunLight Z')
                .min(-20).max(20).step(0.001)
            this.debugFolder.addColor(this.sunLight, 'color')
                .name('sunLight - color')
                .onChange((color) => this.sunLight.color = color);


            this.debugFolder.add(this.sunLight2, 'intensity')
                .name('sunLight2 - intensity')
                .min(0).max(500).step(0.001)
            this.debugFolder.add(this.sunLight2, 'distance')
                .name('sunLight2  - distance')
            this.debugFolder.add(this.sunLight2.position, 'x')
                .name('sunLight2X')
                .min(-20).max(20).step(0.001)
            this.debugFolder.add(this.sunLight2.position, 'y')
                .name('sunLight2Y')
                .min(-20).max(20).step(0.001)
            this.debugFolder.add(this.sunLight2.position, 'z')
                .name('sunLight2Z')
                .min(-20).max(20).step(0.001)
            this.debugFolder.addColor(this.sunLight2, 'color')
                .name('sunLight2 - color')
                .onChange((color) => this.sunLight2.color = color);

            this.helper = new THREE.SpotLightHelper(this.sunLight)
            this.scene.add(this.helper)

            this.helper2 = new THREE.SpotLightHelper(this.sunLight2)
            this.scene.add(this.helper2)
        }
    }

    setAmbientLight() {
        this.ambientLight = new THREE.AmbientLight("#ffffff", 1);
        this.scene.add(this.ambientLight);

        if (this.debug.active && this.ambientLight) {
            this.debugFolder.add(this.ambientLight, 'intensity')
                .name('ambientLight - intensity')
                .min(0).max(1000).step(0.001)
            this.debugFolder.addColor(this.ambientLight, 'color')
                .name('ambientLight - color')
                .onChange((color) => this.ambientLight.color = color);
        }
    }


    setEnvironmentMap() {
        this.environmentMap = {};
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this.resources.items.mainBackground;

        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;
        this.scene.environment = this.environmentMap.texture;
        this.scene.background = this.environmentMap.texture;

        this.environmentMap.updateMaterial = () => {
            this.scene.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMap = this.environmentMap.texture;
                    child.material.envMapIntensity = this.environmentMap.intensity;
                    child.material.needsUpdate = true;
                }
            });
        }

        this.environmentMap.updateMaterial();

        this.setEnvironmentMapDebug()
    }

    watchConfig() {
        this.setConfig()
        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => this.setConfig())
    }

    setConfig() {
        this.ambientLight.intensity = this.experiance.config.stage.lights.ambient.intensity;
    }


    setEnvironmentMapDebug() {
        if (this.debug.active) {
            this.debugFolder.add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0).max(4).step(0.001)
                .onChange(this.environmentMap.updateMaterial)
        }
    }

}