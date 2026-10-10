import Experience from "../../Experiance.js";
import * as THREE from 'three';
import ScoreText from "./ScoreText.js";
import DisposeUtils from "../../Utils/Dispose.js";

export default class ScoreGraphDescription extends ScoreText {
    constructor(material) {
        super()
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.material = material;
    }

    resetMesh(config = {}) {
        this.dispose()

        if (!config?.description) {
            return
        }
        this.mesh = new THREE.Mesh(this.generateGeometry(config.description, 1), this.material)
        return this;
    }

    dispose() {
        DisposeUtils.dispose(this.mesh)
    }
}