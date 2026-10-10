import Experience from "../../../Experiance.js";
import {TextGeometry} from "three/addons/geometries/TextGeometry.js";
import * as THREE from "three";

export default class PlanetText {
    constructor(text, color) {
        this.text = text;
        this.color = color;
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.camera = this.experiance.camera;
        this.setGeometry();
        this.setTextures();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.geometry = new TextGeometry(this.text, {
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
            - this.geometry.boundingBox.max.x * 0.5,
            - this.geometry.boundingBox.max.y * 0.5,
            - this.geometry.boundingBox.max.z * 0.5
        )
    }

    setTextures() {

    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            color: this.color
        })
    }

    setMesh() {
        const y = 4;
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.y = y
    }

    update() {
        this.mesh?.quaternion.copy(this.camera.instance.quaternion);
    }
}