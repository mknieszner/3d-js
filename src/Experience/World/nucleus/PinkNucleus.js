import DefaultNucleus from "./DefaultNucleus.js";
import * as THREE from "three";
import DomainText from "../texts/DomainText.js";
import PlanetShield from "./PlanetShield.js";
import Guard from "../Guard.js";

export default class PinkNucleus extends DefaultNucleus {
    configName = 'pink';

    constructor() {
        super();
        this.setGeometry();
        this.setTextures(['texturePinkNucleus']);
        this.setMaterial();
        this.setMesh();

        this.group = new THREE.Group();

        this.domain7Text = new DomainText('DOMAIN 7', 'Orange')
        this.domain7Text.mesh.position.z = 1.4
        this.domain7Text.mesh.position.y = 0.4
        this.group.add(this.domain7Text.mesh)

        this.domain8Text = new DomainText('DOMAIN 8', 'Orange')
        this.domain8Text.mesh.position.z = 1.4
        this.group.add(this.domain8Text.mesh)

        this.domain9Text = new DomainText('DOMAIN 9', 'Orange')
        this.domain9Text.mesh.position.z = 1.4
        this.domain9Text.mesh.position.y = -0.4
        this.group.add(this.domain9Text.mesh)

        this.shield = new PlanetShield('white')
        this.group.add(this.shield.mesh)

        this.guard = new Guard()
        this.group.add(this.guard.mesh)

        this.group.add(this.nucleus);

        this.scene.add(this.group);

        this.watchClicked();
        this.watchConfig();
    }

    watchClicked() {
        this.scaleOnClicked();
    }

    update() {
        super.update();
        this.shield?.update();
        this.guard?.update();
        this.domain7Text?.update()
        this.domain8Text?.update()
        this.domain9Text?.update()
        super.updateTextPosition([this.domain7Text.mesh, this.domain8Text.mesh, this.domain9Text.mesh]);
    }
}
