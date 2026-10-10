import Experience from "../../../Experiance.js";
import * as THREE from 'three';
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry.js";
import FrontingCameraText from "./FrontingCameraText.js";

export default class DracoText extends FrontingCameraText {
    constructor() {
        super();
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.setGeometry();
        this.setTextures();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.geometry = new TextGeometry('D R A C O', {
            font: this.resources.items.kenpixel_ttf,
            size: 0.20,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
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
        this.textures.color = this.resources.items.textureRedRing;
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.anisotropy = 16
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({map: this.textures.color})
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.y = 1
    }
}