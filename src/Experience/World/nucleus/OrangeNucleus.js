import DefaultNucleus from "./DefaultNucleus.js";
import * as THREE from "three";
import ProcessBText from "../texts/ProcessBText.js";
import PlanetShield from "./PlanetShield.js";
import colorSpaceNode from "three/addons/nodes/display/ColorSpaceNode.js";

export default class OrangeNucleus extends DefaultNucleus {
    configName = 'orange';

    constructor(name) {
        super(name);
        this.setGeometry();
        this.setTextures(['textureOrangeNucleus']);
        this.setMaterial();
        this.setMesh();

        this.text = new ProcessBText();
        this.text.group.position.y = 1
        this.text.group.position.z = 3.1

        this.shield = new PlanetShield('orange', 3.2)

        this.group = new THREE.Group()
        this.group.add(this.text.group)
        this.group.add(this.shield.mesh)
        this.group.add(this.nucleus)

        this.scene.add(this.group);
        this.watchClicked();
        this.watchConfig();
    }

    setMaterial() {
        super.setMaterial();
        // this.material.side = THREE.BackSide
    }

    watchClicked() {
        // this.scaleOnClicked(1, 3);
    }

    update() {
        super.update();
        this.shield?.update()
        this.text?.update()
        super.updateTextPosition(this.text.subMeshes.concat(this.text.mesh), 0.1);
    }
}
