import Experience from "../../Experiance.js";
import * as THREE from 'three';
import Scenario from "../../Scenario/Scenario.js";
import LogoPlane from "../planes/LogoPlane.js";

export default class Intro {
    group = new THREE.Group();

    constructor() {
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.camera = this.experiance.camera;
        this.debug = this.experiance.debug;
        this.setMaterial();
        this.setMeshes();
        this.watchConfig();
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('intro');
            this.debugFolder.close();
        }
    }

    setMaterial() {
        this.lineMaterial = new THREE.MeshBasicMaterial({
            color: 'white',
        })
    }

    setMeshes() {
        this.corporationLogo = this.createLogo('corporationLogo', 2.25, 9);
        this.plane2 = this.createLogo('warsLogo', 2.064, 2.7);

        this.line1 = this.prepareLine()
        this.line1.position.set(  -4, 4.5, -18);

        this.line2 = this.prepareLine();
        this.line2.position.set(  -4, 7.5, -18);

        this.chapterLogo = this.createLogo('chapterLogo', 1.51, 6);

        this.group.add(this.chapterLogo.mesh)
        this.group.add(this.corporationLogo.mesh)
        this.group.add(this.plane2.mesh)
        this.group.add(this.line1)
        this.group.add(this.line2)
        this.scene.add(this.group)
    }

    createLogo(texture, height, y) {
        // Fixed scene height keeps lettering stable when horizontal margins are cropped.
        const image = this.experiance.resources.items[texture].image;
        const width = height * image.width / image.height;
        const logo = new LogoPlane(texture, width, height);
        logo.mesh.position.set(-4, y, -18);
        return logo;
    }

    watchConfig() {
        this.setConfig()
        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => this.setConfig())
    }

    setConfig() {
        setTimeout(() => {
            this.group.visible = !!this.experiance.config.stage?.intro?.scale || false;
        }, 1000)
    }

    update() {
        const cameraPosition = this.camera.instance.position;
        this.line1.lookAt(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        this.line2.lookAt(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        this.corporationLogo.update()
        this.plane2.update()
        this.chapterLogo.update()
    }

    prepareLine() {
        const lineGeometry = new THREE.BoxGeometry(24, 0.1, 0.1);
        const line1 = new THREE.Mesh(lineGeometry, this.lineMaterial)
        line1.corpo_bloomed = true;

        return line1;
    }

}
