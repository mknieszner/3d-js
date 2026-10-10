import * as THREE from 'three';
import DefaultNucleus from "./DefaultNucleus.js";
import ProcessAText from "../texts/ProcessAText.js";
import PlanetShield from "./PlanetShield.js";

export default class RedNucleus extends DefaultNucleus {
    configName = 'red';

    constructor() {
        super();
        this.setGeometry();
        this.setTextures(['textureRedNucleus']);
        this.setMaterial();
        this.setMesh();

        this.text = new ProcessAText();
        this.text.mesh.position.z = 1.4
        this.shield = new PlanetShield('red')

        this.group = new THREE.Group()
        this.group.add(this.text.mesh)
        this.group.add(this.nucleus)
        this.group.add(this.shield.mesh)

        this.scene.add(this.group);
        this.watchClicked();
        this.watchConfig('red')

        this.setDebug()
    }

    watchClicked() {
        this.scaleOnClicked();
    }

    update() {
        super.update();
        this.shield?.update();
        this.text?.update();
        super.updateTextPosition([this.text.mesh]);
    }

}
