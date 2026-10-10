import Experience from "../Experiance.js";
import * as THREE from 'three';

export default class DescriptionPlane {
    constructor(startY, endY, width) {
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.setGeometry(startY, endY, width);
        this.setTextures();
        this.setMaterial();
        this.setMesh(startY, endY);
    }

    setGeometry(startY, endY, width) {
        this.geometry = new THREE.PlaneGeometry(width,endY - startY,10)
    }

    setTextures() {

    }

    setMaterial() {
        this.material = new THREE.MeshBasicMaterial({
            color: 'black',
            opacity: 0.5,
            transparent: true,
            side: THREE.DoubleSide
        })
    }

    setMesh(startY, endY) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.y = ((startY + endY) / 2)
        this.scene.add(this.mesh)
    }
}