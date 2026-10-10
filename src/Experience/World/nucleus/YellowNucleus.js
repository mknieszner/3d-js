import DefaultNucleus from "./DefaultNucleus.js";
import * as THREE from "three";
import DomainText from "../texts/DomainText.js";
import PlanetShield from "./PlanetShield.js";
import Guard from "../Guard.js";

export default class YellowNucleus extends DefaultNucleus {
    configName = 'yellow'

    constructor(name) {
        super(name);
        this.setGeometry();
        this.setTextures(['textureYellowNucleus']);
        this.setMaterial();
        this.setMesh();

        this.group = new THREE.Group();

        this.domain10Text = new DomainText('DOMAIN 10', 'Orange')
        this.domain10Text.mesh.position.z = 1.4
        this.domain10Text.mesh.position.y = 0.4
        this.group.add(this.domain10Text.mesh)

        this.domain11Text = new DomainText('DOMAIN 11', 'Orange')
        this.domain11Text.mesh.position.z = 1.4
        this.group.add(this.domain11Text.mesh)

        this.domain12Text = new DomainText('DOMAIN 12', 'Orange')
        this.domain12Text.mesh.position.z = 1.4
        this.domain12Text.mesh.position.y = -0.4
        this.group.add(this.domain12Text.mesh)

        this.group.add(this.nucleus)

        this.shield = new PlanetShield('white')
        this.group.add(this.shield.mesh)

        this.guard = new Guard()
        this.group.add(this.guard.mesh)

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
        this.domain10Text?.update();
        this.domain11Text?.update();
        this.domain12Text?.update();
        super.updateTextPosition([this.domain10Text.mesh, this.domain11Text.mesh, this.domain12Text.mesh]);
    }
}
