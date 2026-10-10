import DefaultNucleus from "./DefaultNucleus.js";
import * as THREE from "three";
import DomainText from "../texts/DomainText.js";
import Scenario from "../../Scenario/Scenario.js";
import PlanetShield from "./PlanetShield.js";
import Guard from "../Guard.js";

export default class PurpleNucleus extends DefaultNucleus {
    configName = 'purple';

    constructor(name) {
        super(name);
        this.setGeometry();
        this.setTextures(['texturePurpleNucleus']);
        this.setMaterial();
        this.setMesh();
        this.group = new THREE.Group();

        this.domain4Text = new DomainText('DOMAIN 4', 'Orange')
        this.domain4Text.mesh.position.z = 1.4
        this.domain4Text.mesh.position.y = 0.4
        this.group.add(this.domain4Text.mesh)

        this.domain5Text = new DomainText('DOMAIN 5', 'Orange')
        this.domain5Text.mesh.position.z = 1.4
        this.group.add(this.domain5Text.mesh)

        this.domain6Text = new DomainText('DOMAIN 6', 'Orange')
        this.domain6Text.mesh.position.z = 1.4
        this.domain6Text.mesh.position.y = -0.4
        this.group.add(this.domain6Text.mesh)

        this.group.add(this.nucleus)

        this.shield = new PlanetShield('white')
        this.group.add(this.shield.mesh)

        this.guard = new Guard()
        this.group.add(this.guard.mesh)

        this.scene.add(this.group);

        this.watchClicked();
        this.watchConfig('purple');
    }

    watchClicked() {
        this.scaleOnClicked();
    }

    update() {
        super.update();
        this.shield?.update();
        this.guard?.update();
        this.domain4Text?.update();
        this.domain5Text?.update();
        this.domain6Text?.update();
        super.updateTextPosition([this.domain4Text.mesh, this.domain5Text.mesh, this.domain6Text.mesh]);
    }
}
