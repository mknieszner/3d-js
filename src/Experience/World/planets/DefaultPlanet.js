import * as THREE from "three";
import Experience from "../../Experiance.js";
import Scenario from "../../Scenario/Scenario.js";
import PlanetBase from "./Models/Planet.js";
import OrbitLine from "../OrbitLine.js";
import EllipticalOrbit from "../EllipticalOrbit.js";
import StellarActivity from "./StellarActivity.js";

export default class DefaultPlanet extends PlanetBase {
    constructor(textureName, radius, orbitRadius, speed, text, orbitalElements = {}, stellarOptions = {}) {
        super();
        this.radius = radius;
        this.orbitRadius = orbitRadius;
        this.text = text;
        this.stellarOptions = stellarOptions;
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.time = this.experiance.time;
        this.speed = speed;
        this.setGeometry();
        this.setTextures(textureName);
        this.setMaterial();
        this.setMesh();
        this.setOrbit(orbitalElements);

        this.watchConfig();
    }

    setGeometry() {
        this.geometry = new THREE.SphereGeometry(this.radius, 30, 30)
    }

    setTextures(textureName) {
        this.textures = {}
        this.textures.color = this.resources.items[textureName];
        this.textures.color.colorSpace = THREE.SRGBColorSpace
    }

    setMaterial() {
        this.lambertMaterial = new THREE.MeshStandardMaterial({
            map: this.textures.color
        });
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.lambertMaterial);


        this.group = new THREE.Group();
        this.group.add(this.mesh);
        this.stellarActivity = new StellarActivity(
            this.radius, this.text.color, this.radius * 7.13, this.lambertMaterial, this.stellarOptions
        );
        this.mesh.add(this.stellarActivity);
        this.group.add(this.text.mesh);

        this.scene.add(this.group)
    }

    setOrbit(orbitalElements = {}) {
        this.orbitPath = new EllipticalOrbit({phase: 180, ...orbitalElements});
        this.orbit = new OrbitLine(this.text.color, this.orbitPath);
        this.orbit.name = `${this.text.text}-orbit`;
        this.orbit.setOrbit(this.orbitRadius, {x: 1, y: 0, z: 0});
        this.scene.add(this.orbit);
    }

    watchConfig() {
        this.setConfig()
        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => this.setConfig())
    }

    setConfig() {
        this.targetScale = this.experiance.config.stage?.defaultPlanet.scale;
    }

    update() {
        this.text?.update();

        if (!this.orbitRadius) {
            return
        }
        this.mesh.rotation.y += 0.006 * this.time.frameScale;

        this.orbitPath.getPosition(this.time.elapsed * 0.00001 * this.speed, this.group.position)
            .multiplyScalar(this.orbitRadius)
            .add(this.orbit.position);
        this.updateScale();
        if (this.group.visible) this.stellarActivity?.update(this.time.elapsed);
        this.orbit.visible = this.targetScale > 0 && this.group.visible;
        this.orbit.material.opacity = this.orbit.baseOpacity * Math.min(1, this.group.scale.x);

    }
}
