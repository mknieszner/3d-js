import Experience from "../../Experiance.js";
import * as THREE from "three";
import Scenario from "../../Scenario/Scenario.js";

export default class PlanetShield {
    targetScale = 0

    constructor(configName = 'white', radius = 1.4) {
        this.configName = configName;
        this.radius = radius;
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.watchConfig();
        this.setGeometry();
        this.setMaterial();
        this.setMesh()
    }

    setGeometry() {
        //   this.geometry = new THREE.SphereGeometry(this.radius, 100, 100, 0, Math.PI / 2, 0, Math.PI); theta update?
        this.geometry = new THREE.SphereGeometry(this.radius, 100, 100);
    }

    setMaterial() {
        this.textures = {}
        this.textures.alpha = this.resources.items.alphaCage;
        this.textures.alpha.colorSpace = THREE.SRGBColorSpace

        this.material = new THREE.MeshBasicMaterial({
            color: this.color,
            alphaMap: this.textures.alpha,
            transparent: true,
            depthWrite  : false
        });
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.scale.set(this.targetScale, this.targetScale, this.targetScale)
        this.scene.add(this.mesh)
    }


    update() {
        this.mesh.rotation.y += 0.002 * this.experiance.time.frameScale;
        this.updateScale();
    }


    updateScale() {
        const damping = this.experiance.time.damping(1 / 40);
        const deltaX = this.targetScale - this.mesh.scale.x;
        const deltaY = this.targetScale - this.mesh.scale.y;
        const deltaZ = this.targetScale - this.mesh.scale.z;

        if (Math.abs(deltaX) > 0.001 || Math.abs(deltaY) > 0.001 || Math.abs(deltaZ) > 0.001) {
            this.mesh.scale.set(
                this.mesh.scale.x + deltaX * damping,
                this.mesh.scale.y + deltaY * damping,
                this.mesh.scale.z + deltaZ * damping
            )
        } else {
            this.mesh.scale.setScalar(this.targetScale);
        }
    }

    watchConfig() {
        this.setConfig()
        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => this.setConfig())
    }

    setConfig() {
        this.targetScale = this.experiance.config.stage.shield[this.configName].scale;
        this.color = this.experiance.config.stage.shield[this.configName].color;
    }


}
