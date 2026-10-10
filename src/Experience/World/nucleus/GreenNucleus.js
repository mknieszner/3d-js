import * as THREE from "three";
import DefaultNucleus from "./DefaultNucleus.js";
import ProcessCText from "../texts/ProcessCText.js";
import PlanetShield from "./PlanetShield.js";

export default class GreenNucleus extends DefaultNucleus {
    texture = null;
    configName = 'green';

    constructor() {
        super();
        this.setGeometry();
        this.setTextures(['textureGreenNucleus']);
        this.setMaterial();
        this.setMesh();
        this.text = new ProcessCText();
        // this.text.mesh.position.z = 1.4

        this.shield = new PlanetShield('green')

        this.group = new THREE.Group()
        this.group.add(this.text.mesh)
        this.group.add(this.nucleus)
        this.group.add(this.shield.mesh)

        this.scene.add(this.group);
        this.scaleOnClicked();
        this.watchConfig();

        this.setDebug();
    }

    update() {
        super.update();
        this.shield?.update();
        this.text?.update();
        super.updateTextPosition([this.text.mesh]);
    }
}
