import Experience from "../../Experiance.js";
import Scenario from "../../Scenario/Scenario.js";
import * as THREE from "three";
import DescriptionText from "../texts/DescriptionText.js";
import Actor from "./Actor.js";

const DEFAULT_CONFIG = {
    insideLightIntensity: 30,
    actorLightIntensity: 1000
}

export default class Bridge {
    constructor() {
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.time = this.experiance.time;
        this.camera = this.experiance.camera;
        this.debug = this.experiance.debug;

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('bridge');
            this.debugFolder.close();
        }

        this.setMesh();
        this.setConfig()
        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => this.setConfig())
    }

    setConfig() {
        this.scale = this.experiance.config.stage.cockpit.scale;
        this.group.visible = this.scale !== 0;
    }

    setMesh() {
        this.group = new THREE.Group()
        this.setBridge();
        this.setMassage();
        this.setActor();
        this.setActorNeonLight();
        this.setScreenLight();

        this.scene.add(this.group);
    }

    setScreenLight() {
        this.insideLight = new THREE.PointLight("violet", DEFAULT_CONFIG.insideLightIntensity, 100, 0.8);
        this.insideLight.position.set(0, 30, 45)
        this.group.add(this.insideLight);


        if (this.debug.active && this.insideLight) {
            this.debugFolder.add(this.insideLight, 'intensity')
                .name('insideLight - intensity')
                .min(0).max(100).step(0.001)
            this.debugFolder.add(this.insideLight, 'decay')
                .name('insideLight - decay')
                .min(0).max(1).step(0.001)
            this.debugFolder.add(this.insideLight, 'distance')
                .name('insideLight - distance')
                .min(0).max(100).step(1)
            this.debugFolder.add(this.insideLight.position, 'x')
                .name('insideLight - X')
                .min(-100).max(100).step(1)
            this.debugFolder.add(this.insideLight.position, 'y')
                .name('insideLight - Y')
                .min(-100).max(100).step(1)
            this.debugFolder.add(this.insideLight.position, 'z')

                .name('insideLight - Z')
                .min(-100).max(100).step(1)

            this.screenLightHelper = new THREE.PointLightHelper(this.insideLight);
            this.group.add(this.screenLightHelper);
        }
    }

    setBridge() {
        this.mesh = this.resources.items.bridge.scene.children[0].children[0];
        this.mesh.traverse(child => {
            if (child.isMesh && child.name === "Sci-Fi_Space_Station_SidesLighting_0") {
                this.sprecialMaterial = child.material.clone()
                // child.corpo_bloomed = true
            }
            if ([
                "Sci-Fi_Space_Station_Chair_0",
                "Sci-Fi_Space_Station_Backdrop_0",
                "Sci-Fi_Space_Station_RoofBackdrop_0",
                "Sci-Fi_Space_Station_Seat_0",
                "Sci-Fi_Space_Station_Door_0",
                "Sci-Fi_Space_Station_TrimRoof_0",
                "Sci-Sci-Fi_Space_Station_Floor_0",
                "Sci-Sci-Sci-Fi_Space_Station_FloorMiddle_0",
                "Camera",
            ].includes(child.name)) {
                child.visible = false;
            }
        });

        this.mesh.position.z = 75;
        this.mesh.rotation.set(Math.PI, Math.PI, Math.PI);
        this.group.add(this.mesh);
    }

    setMassage() {
        this.screenMessage = new DescriptionText({isTexture: false, material:  this.sprecialMaterial });
        this.screenMessage.group.position.x = -5;
        this.screenMessage.group.position.y = 7
        this.screenMessage.group.position.z = 55;
        this.group.add(this.screenMessage.group);
    }

    setActor() {
        this.actor = new Actor();
        this.actor.group.position.x = 3.3;
        this.actor.group.position.y = 10.2;
        this.actor.group.position.z = 63.1;
        this.actor.group.scale.set(1.5, 1.5,1.5);

        this.group.add(this.actor.group);

        if (this.debug.active && this.actor.group) {
            this.debugFolder.add(this.actor.group.position, 'x')
                .name('actor - X')
                .min(-100).max(100).step(0.001)
            this.debugFolder.add(this.actor.group.position, 'y')
                .name('actor - Y')
                .min(-100).max(100).step(0.001)
            this.debugFolder.add(this.actor.group.position, 'z')
                .name('actor - Z')
                .min(-100).max(100).step(0.001)
        }
    }

    setActorNeonLight() {
        this.actorLight = new THREE.SpotLight(0xffffff, DEFAULT_CONFIG.actorLightIntensity);
        this.actorLight.position.x = 20.4;
        this.actorLight.position.y = 5.4;
        this.actorLight.position.z = 82;
        this.actorLight.angle = Math.PI / 3;
        this.actorLight.penumbra = 1;
        this.actorLight.decay = 1;
        this.actorLight.distance = 17.8;
        this.actorLight.map = this.resources.items.aquaNavy;
        // this.actorLight.castShadow = true;
        // this.actorLight.shadow.mapSize.width = 1024;
        // this.actorLight.shadow.mapSize.height = 1024;
        // this.actorLight.shadow.camera.near = 1;
        // this.actorLight.shadow.camera.far = 10;
        // this.actorLight.shadow.focus = 1;
        this.group.add(this.actorLight);

        if (this.debug.active && this.actorLight) {
            this.actorLightHelper = new THREE.SpotLightHelper(this.actorLight);
            this.group.add(this.actorLightHelper);
            this.debugFolder.add(this.actorLight, 'intensity')
                .name('actorLight - intensity')
                .min(0).max(5000).step(0.001)
            this.debugFolder.add(this.actorLight, 'decay')
                .name('actorLight - decay')
                .min(0).max(1).step(0.001)
            this.debugFolder.add(this.actorLight, 'penumbra')
                .name('actorLight - penumbra')
                .min(0).max(3).step(0.001)
            this.debugFolder.add(this.actorLight, 'distance')
                .name('actorLight - distance')
                .min(0).max(50).step(0.001)
            this.debugFolder.add(this.actorLight.position, 'x')
                .name('actorLight - x')
                .min(-100).max(100).step(0.001)
            this.debugFolder.add(this.actorLight.position, 'y')
                .name('actorLight - y')
                .min(-100).max(100).step(0.001)
            this.debugFolder.add(this.actorLight.position, 'z')
                .name('actorLight - z')
                .min(-100).max(100).step(0.001)
        }
    }

    update() {
        this.actor?.update()
        this.video?.update();
    }

}