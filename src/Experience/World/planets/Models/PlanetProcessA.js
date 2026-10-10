import Experience from "../../../Experiance.js";
import * as THREE from "three";
import Scenario from "../../../Scenario/Scenario.js";
import PlanetBase from "./Planet.js";

export default class PlanetProcessA extends PlanetBase {
    defaultPosition = {x: -6.5, y: -1.8, z: 0}

    constructor() {
        super();
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.setMesh()
        this.watchConfig();
    }

    setMesh() {
        this.mesh = this.resources.items.planet2.scene.children[0];
        this.group = new THREE.Group()

        this.group.scale.set(0, 0, 0);
        this.group.position.set(this.defaultPosition.x, this.defaultPosition.y, this.defaultPosition.z);

        this.group.add(this.mesh);
        this.scene.add(this.group);
    }

    update() {
        this.updateScale();
        this.updatePosition();
        this.mesh.rotation.z += 0.001 * this.experiance.time.frameScale
    }

    watchConfig() {
        this.setConfig()
        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => this.setConfig())
    }

    setConfig() {
        this.targetScale = this.experiance.config.stage.planets?.planet2.scale;
        this.targetPosition = this.experiance.config.stage.planets?.planet2?.position || this.defaultPosition;
    }
}
