import Experience from "../../Experiance.js";
import * as THREE from 'three';
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry.js";
import Scenario from "../../Scenario/Scenario.js";
import DefaultText from "./DefaultText.js";

export default class DomainText extends DefaultText {
    constructor(text, color) {
        super();
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.setGeometry(text);
        this.setTextures(color);
        this.setMaterial();
        this.setMesh();

        this.watchConfig();
    }

    setGeometry(text) {
        this.geometry = new TextGeometry(text, {
            font: this.resources.items.kenpixel_ttf,
            size: 0.2,
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

    setTextures(color) {
        this.textures = {}
        this.textures.color = this.resources.items['texture' + color + 'Ring'];
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
        this.targetScale = this.experiance.config.stage.texts.domain.scale;

        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => {
            this.targetScale = this.experiance.config.stage.texts.domain.scale;
        })
    }

    update() {
        this.updateScale();
    }

    get scaleMesh() {
        return this.mesh;
    }
}