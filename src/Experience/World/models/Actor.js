import Experience from "../../Experiance.js";
import * as THREE from "three";
import Scenario from "../../Scenario/Scenario.js";

export const NeonColors = {
    DEFAULT: {
        MAIN: "#97C9DA",
        FRAME: "#276177"
    },
    GREEN: {
        MAIN: "darkgreen",
        FRAME: "darkgreen"
    },
    RED: {
        MAIN: "red",
        FRAME: "darkred"
    }
}

export default class Actor {
    targetScale = 0
    targetX = 0
    targetOpacity = 0
    targetActor = ''

    constructor() {
        this.experiance = Experience.INSTANCE;
        this.resources = this.experiance.resources;
        this.debug = this.experiance.debug;

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('actor');
            this.debugFolder.close();
        }

        this.setMaterial()
        this.setMesh()
        this.watchConfig();
    }

    setMaterial() {
        this.transparentMaterial = new THREE.MeshStandardMaterial({
            color: NeonColors.DEFAULT.MAIN,
            opacity: 0.01,
            transparent: true,
            side: THREE.TwoPassDoubleSide
        });

        this.material = new THREE.MeshStandardMaterial({
            color: NeonColors.DEFAULT.MAIN,
            opacity: 0.05,
            transparent: true,
            side: THREE.TwoPassDoubleSide
        });

        this.wireframeMaterial = new THREE.MeshStandardMaterial({
            color: NeonColors.DEFAULT.FRAME,
            opacity: 0.1,
            transparent: true,
            side: THREE.DoubleSide,
            wireframe: true
        });

        this.ringMaterial = new THREE.MeshStandardMaterial({
            color: NeonColors.DEFAULT.MAIN
        });

        if (this.debug.active) {
            this.debugFolder.add(this.material, 'opacity')
                .name('materialOpacity')
                .min(0).max(1).step(0.0001)
            this.debugFolder.add(this.transparentMaterial, 'opacity')
                .name('transparentMaterialOpacity')
                .min(0).max(1).step(0.0001)
            this.debugFolder.add(this.wireframeMaterial, 'opacity')
                .name('wireframeMaterialOpacity')
                .min(0).max(1).step(0.0001)
            this.debugFolder.add(this.ringMaterial, 'opacity')
                .name('ringMaterialOpacity')
                .min(0).max(1).step(0.0001)
        }

    }

    setMesh() {
        this.group = new THREE.Group();
        this.setModel();
        this.setStand();
        this.setRings();

        this.group.scale.set(this.targetScale, this.targetScale, this.targetScale)
    }

    setModel() {
        this.zombieYelling = this.resources.items.zombieYellingModel;
        this.zombieYelling.scale.set(0.05, 0.05, 0.05);
        this.zombieYelling.rotation.y = -Math.PI / 12;

        this.zombieAgony = this.resources.items.zombieAgonyModel;
        this.zombieAgony.scale.set(0.06, 0.06, 0.06);
        this.zombieAgony.rotation.y = -Math.PI / 12;

        this.zombieArgue = this.resources.items.zombieArgueModel;
        this.zombieArgue.scale.set(0.06, 0.06, 0.06);

        this.zombieVictory = this.resources.items.zombieVictoryModel;
        this.zombieVictory.scale.set(0.06, 0.06, 0.06);
        this.zombieVictory.rotation.y = -Math.PI / 12;

        this.zombieSalute = this.resources.items.zombieSaluteModel;
        this.zombieSalute.scale.set(0.06, 0.06, 0.06);
        this.zombieSalute.rotation.y = -Math.PI / 6;

        [
            this.zombieYelling,
            this.zombieArgue,
            this.zombieAgony,
            this.zombieVictory,
            this.zombieSalute
        ].forEach(zombie => {
            zombie.position.set(8, -8.5, 5);
        });

        [
            this.zombieYelling,
            this.zombieArgue,
            this.zombieAgony,
            this.zombieVictory,
            this.zombieSalute
        ].forEach(zombie => zombie.traverse((child) => {
                if (child.material && !child.corpo_wireframe) {
                    child.material = this.transparentMaterial;

                    const mesh = child.clone();
                    mesh.material = this.wireframeMaterial;
                    mesh.corpo_bloomed = true;
                    mesh.corpo_wireframe = true;
                    child.add(mesh)
                    child.corpo_bloomed = true;
                }
            })
        );

        this.group.add(this.zombieYelling)
        this.group.add(this.zombieArgue)
        this.group.add(this.zombieAgony)
        this.group.add(this.zombieVictory)
        this.group.add(this.zombieSalute)
    }

    setStand() {
        this.actorStand = this.resources.items.actorStand.scene;
        this.actorStand.traverse((child) => {
            if (child.material && !child.corpo_wireframe) {
                child.material = this.material;

                const wireframeMesh = child.clone();
                wireframeMesh.material = this.wireframeMaterial;
                wireframeMesh.corpo_bloomed = true;
                wireframeMesh.corpo_wireframe = true;
                child.add(wireframeMesh)
                child.corpo_bloomed = true;
            }
        });
        this.group.add(this.actorStand)
    }

    setRings() {
        this.rings = [1, 2, 3].map((number) => new THREE.Mesh(
            new THREE.TorusGeometry(3 + 0.3 * number, 0.01, 32, 64),
            this.ringMaterial
        ))
            .map((mesh, index) => {
                mesh.rotation.x = Math.PI / 2
                mesh.corpo_bloomed = true;
                mesh.corpo_velicity = ((index + 1) * 0.03);
                return mesh
            });

        this.rings.forEach(ring => this.group.add(ring))
    }

    update() {
        this.updateZombie();
        this.updateRings();
    }

    watchConfig() {
        this.setConfig()
        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => this.setConfig())
    }

    setConfig() {
        this.targetScale = this.experiance.config.stage.description.scale;
        this.targetX = !this.targetScale ? -400 : 0;
        this.targetActor = this.experiance.config.stage.description.activeActor;
        this.targetOpacity = this.experiance.config.stage.description.targetOpacity || 0;
    }

    updateZombie() {
        this.actorStand.visible = !!this.activeActor;

        if (!this.zombieArgue || !this.zombieYelling || !this.zombieAgony || !this.zombieVictory) {
            return
        }

        if (this.targetActor === this.activeActor) {
            return
        }

        this.activeActor = this.targetActor

        this.zombieYelling.visible = false;
        this.zombieArgue.visible = false;
        this.zombieAgony.visible = false;
        this.zombieVictory.visible = false;
        this.zombieSalute.visible = false;


        if (this.activeActor === 'zombieYelling') {
            this.zombieYelling.visible = true;
            this.updateStand(this.zombieYelling.position);
        }
        if (this.activeActor === 'zombieAgony') {
            this.zombieAgony.visible = true;
            this.updateStand(this.zombieAgony.position);
        }
        if (this.activeActor === 'zombieArgue') {
            this.zombieArgue.visible = true;
            this.updateStand(this.zombieArgue.position);
        }
        if (this.activeActor === 'zombieVictory') {
            this.zombieVictory.visible = true;
            this.updateStand(this.zombieVictory.position);
        }
        if (this.activeActor === 'zombieSalute') {
            this.zombieSalute.visible = true;
            this.updateStand({
                ...this.zombieSalute.position,
                z: this.zombieSalute.position.z - 1
            });
        }
    }

    updateStand(actorPosition) {
        this.actorStand.visible = !!this.activeActor;

        if (!actorPosition) {
            return
        }
        this.actorStand.position.set(
            actorPosition.x,
            actorPosition.y - 0.5,
            actorPosition.z + 1
        );
        this.activeActorPosition = actorPosition;
    }


    updateRings() {
        this.rings.forEach((ring, index) => this.updateRing(ring, index, this.activeActorPosition));
    }

    updateRing(ring, index, actorPosition) {
        ring.visible = !!this.targetActor;

        if (!actorPosition) {
            return
        }
        const min = -6;
        const max = 2;
        const range = max - min;
        // Carry the overshoot through each bounce, even on a longer frame.
        ring.corpo_phase = ((ring.corpo_phase ?? (ring.position.y - min))
            + ring.corpo_velicity * this.experiance.time.frameScale) % (2 * range);
        const ringY = min + Math.min(ring.corpo_phase, 2 * range - ring.corpo_phase);

        ring.position.set(
            actorPosition.x,
            ringY,
            actorPosition.z + 1
        )
    }
}
