import Experience from "../../Experiance.js";
import * as THREE from "three";
import HolographicMaterial from "../../Utils/HolographicMaterial.js";

export default class ActorHologram {
    targetScale = 0;

    constructor() {
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.setGeometry();
        this.setTextures();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.geometry = new THREE.CylinderGeometry(5, 2.4, 11, 20);
    }

    setTextures() {

    }

    setMaterial() {
        this.material = new HolographicMaterial();
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    update() {
        this.material.update()
    }

}
