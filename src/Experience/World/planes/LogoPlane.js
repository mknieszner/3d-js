import Experience from "../../Experiance.js";
import * as THREE from 'three';

export default class LogoPlane {

    constructor(texture, width, height) {
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.camera = this.experiance.camera;
        this.setGeometry(width, height);
        this.setTextures(texture);
        this.setMaterial();
        this.setMesh();
    }

    setGeometry(width, height) {
        this.geometry = new THREE.PlaneGeometry(width,height,10, 10)
    }

    setTextures(texture) {
        this.textures = {}
        this.textures.color = this.resources.items?.[texture];
        this.textures.alpha = this.resources.items?.[texture];
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.anisotropy = 16
    }

    setMaterial() {
        this.material = new THREE.MeshBasicMaterial({
            map: this.textures.color,
            alphaMap: this.textures.alpha,
            transparent: true,
            depthWrite  : false
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    update() {
        const cameraPosition = this.camera.instance.position;
        this.mesh.lookAt(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    }
}