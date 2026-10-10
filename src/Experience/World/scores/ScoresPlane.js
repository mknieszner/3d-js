import Experience from "../../Experiance.js";
import {RectangleRounded} from "../../Utils/RectangleRounded.js";
import * as THREE from "three";
import DisposeUtils from "../../Utils/Dispose.js";

export default class ScoresPlane {

    constructor(position, lookAtPosition) {
        this.position = position;
        this.lookAtPosition = lookAtPosition;
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;

        this.setGeometry();
        this.setMaterial();
        this.resetMesh();
    }

    setGeometry() {
        this.geometry = new RectangleRounded(50, 28, 2, 10);
    }

    setMaterial() {
        this.material = new THREE.MeshBasicMaterial({
            color: 'black',
            opacity: 0.8,
            transparent: true,
            side: THREE.DoubleSide
        });
    }

    resetMesh(config) {
        this.dispose()

        if(!config?.scale || !config?.data1) {
            return
        }

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.mesh.lookAt(this.lookAtPosition.x, this.position.y,this.lookAtPosition.z);
        this.scene.add(this.mesh);
    }

    dispose() {
        DisposeUtils.dispose(this.mesh)
    }
}