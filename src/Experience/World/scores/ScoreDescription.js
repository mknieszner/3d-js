import Experience from "../../Experiance.js";
import * as THREE from 'three';
import ScoreText from "./ScoreText.js";
import DisposeUtils from "../../Utils/Dispose.js";

export default class ScoreDescription extends ScoreText {
    constructor(material, position, lookAtPosition) {
        super()
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

    resetMesh(config = {}) {
        this.dispose()

        if (!config?.description) {
            return
        }
        this.material.opacity = config.opacity
        this.mesh = new THREE.Mesh(this.generateGeometry(config.description, config.descriptionSize ?? 0.8), this.material)
        this.mesh.corpo_bloomed = true;
        this.mesh.position.x = this.position.x
        this.mesh.position.y = config.y
        this.mesh.position.z = this.position.z
        this.mesh.lookAt(this.lookAtPosition.x, config.y, this.lookAtPosition.z);
        this.scene.add(this.mesh)
    }

    dispose() {
        DisposeUtils.dispose(this.mesh)
    }
}