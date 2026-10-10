import * as THREE from "three";
import Experience from "../../Experiance.js";
import DisposeUtils from "../../Utils/Dispose.js";
import {TextGeometry} from "three/addons/geometries/TextGeometry.js";

export default class StarText {
    group = new THREE.Group();

    constructor({color, text, position, size, font, opacity }) {
        this.position = new THREE.Vector3(position.x, position.y, position.z)
        this.size = size
        this.opacity = opacity || 1
        this.font = font || 'star_wars_ttf'
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.camera = this.experiance.camera;
        this.setMaterial(color);
        this.resetMesh(text);
    }

    setMaterial(color) {
        this.material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: this.opacity
        });
    }

    resetMesh(text) {
        this.dispose()
        this.mesh = new THREE.Mesh(this.generateGeometry(
            text,
            this.size,
            this.font
        ), this.material)

        this.mesh.position.set(
            this.position.x,
            this.position.y,
            this.position.z,
        );
        this.mesh.corpo_bloomed = true;
    }

    update() {
        const cameraPosition = this.camera.instance.position;
        this.mesh.lookAt(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    }

    generateGeometry(text, size = 1.5, font = 'kenpixel_ttf') {
        const geometry = new TextGeometry(text, {
            font: this.resources.items?.[font],
            size,
            height: 0.5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.02,
            bevelOffset: -0.04,
            bevelSegments: 5
        })
        geometry.computeBoundingBox()
        geometry.translate(
            -geometry.boundingBox.max.x * 0.5,
            -geometry.boundingBox.max.y * 0.5,
            -geometry.boundingBox.max.z * 0.5
        )
        return geometry;
    }

    dispose() {
        DisposeUtils.dispose(this.mesh)
    }
}