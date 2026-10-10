import Experience from "../../Experiance.js";
import * as THREE from 'three';
import ScoreText from "./ScoreText.js";
import DisposeUtils from "../../Utils/Dispose.js";

export default class ScoreTitle extends ScoreText {
    constructor(material, position, lookAtPosition) {
        super();
        this.position = position;
        this.lookAtPosition = lookAtPosition;
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.setTextures();
        this.setMaterial(material);
    }

    setTextures() {
        this.textures = {}
        this.textures.color = this.resources.items.textureRedRing;
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.anisotropy = 16
    }

    setMaterial(material) {
        this.material = material;
        this.material.transparent = true;
        this.material.needsUpdate = true;
    }

    resetMesh(config) {
        this.dispose()

        if (!config?.title) {
            return
        }
        this.material.opacity = config.opacity
        this.mesh = new THREE.Mesh(this.generateGeometry(config.title, 1.5), this.material)
        this.mesh.corpo_bloomed = true;
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.mesh.lookAt(this.lookAtPosition.x, this.position.y, this.lookAtPosition.z);
        this.scene.add(this.mesh)
    }

    dispose() {
        DisposeUtils.dispose(this.mesh)
    }
}