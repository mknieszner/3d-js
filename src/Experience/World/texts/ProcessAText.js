import Experience from "../../Experiance.js";
import * as THREE from 'three';
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry.js";
import Scenario from "../../Scenario/Scenario.js";
import DefaultText from "./DefaultText.js";

export default class ProcessAText extends DefaultText {
    constructor() {
        super();
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.setGeometry();
        this.setTextures();
        this.setMaterial();
        this.setMesh();

        this.watchConfig();
    }

    setGeometry() {
        this.geometry = new TextGeometry('PROCES A', {
            font: this.resources.items.kenpixel_ttf,
            size: 0.3,
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
        this.mesh.corpo_bloomed = true;
        this.mesh.scale.set(0, 0, 0);
    }

    watchConfig() {
        this.targetScale = this.experiance.config.stage.texts.processA.scale;

        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => {
            this.targetScale = this.experiance.config.stage.texts.processA.scale;
        })
    }

    update() {
        this.updateScale();
    }

    get scaleMesh() {
        return this.mesh;
    }
}
