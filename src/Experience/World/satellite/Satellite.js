import Experience from "../../Experiance.js";
import * as THREE from "three";
import Scenario from "../../Scenario/Scenario.js";
import Mouse from "../../Utils/Mouse.js";
import DottedOrbit from "../DottedOrbit.js";

// Offset the dots so capsules sharing one path keep all their team colors visible.
const ORBIT_STYLES = {
    draco: {color: 0xd85045, dotOffset: 0},
    taurus: {color: 0x62ad6f, dotOffset: 0.25},
    aquarius: {color: 0xc78b54, dotOffset: 0.5},
    gemini: {color: 0xa3b5cf, dotOffset: 0.75},
    domain: {color: 0xcbcccc, dotOffset: 0},
};

export default class Satellite {
    constructor(configName, modelName, text, updateRotation = true) {
        this.configName = configName;
        this.modelName = modelName;
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.time = this.experiance.time;
        this.raycaster = this.experiance.raycaster;
        this.camera = this.experiance.camera;
        this.mouse = this.experiance.mouse;
        this.updateRotation = updateRotation
        this.setMesh(text);
        this.setOrbit();
        this.setConfig()
        this.followCameraOnClicked();
        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => this.setConfig())
    }

    setConfig() {
        this.radius = this.experiance.config.stage.satellite[this.configName].radius;
        this.position = this.experiance.config.stage.satellite[this.configName].position;
        this.scale = this.experiance.config.stage.satellite[this.configName].scale;
        this.updateRotationOverPlanet = this.experiance.config.stage.satellite.update;
        this.selfRotationVelocity = this.experiance.config.stage.satellite.selfRotationVelocity;
        this.orbit.setOrbit(this.radius, this.position);
        this.orbit.visible = this.scale > 0 && this.radius > 0 && this.updateRotationOverPlanet;
    }

    setOrbit() {
        const {color, dotOffset} = ORBIT_STYLES[this.configName] || {color: 0xffffff, dotOffset: 0};
        this.orbit = new DottedOrbit(color, {tilted: true, dotCount: 48, dotOffset});
        this.orbit.name = `${this.configName}-orbit`;
        this.scene.add(this.orbit);
    }

    setMesh(text) {
        this.plane = this.getClickablePlane();

        const model = this.resources.items[this.modelName];

        if (this.modelName === 'baseRocket3') {
            this.mesh = model.scene.children[0].children[0].children[2].children[1];
        } else {
            this.mesh = model.scene.children[0];
        }

        this.text = text;


        this.group = new THREE.Group()
        this.group.add(this.plane);
        this.group.add(this.text.mesh)
        this.group.add(this.mesh)
        this.scene.add(this.group);
    }

    update(ndx) {
        if (!this.mesh) {
            return
        }

        this.rotateAroundPosition(ndx)
        this.rotateAroundSelf(ndx)
        this.text?.update()

        this.mesh.scale.set(this.scale, this.scale, this.scale);

        if (this.group.visible !== (this.scale !== 0)) {
            this.group.visible = this.scale !== 0
        }

        if (this.scale === 0) {
            this.text.mesh.scale.set(this.scale, this.scale, this.scale)
        } else {
            this.text.mesh.scale.set(1, 1, 1)
        }
        this.plane?.quaternion.copy(Experience.INSTANCE.camera.instance.quaternion);
    }

    rotateAroundPosition(ndx) {
        if (this.updateRotationOverPlanet) {
            const time = this.time.elapsed * 0.00005 * Math.PI;
            this.group.position.set(
                Math.cos(time + Math.PI * 0.5 + ndx) * this.radius + this.position.x,
                Math.sin(time + Math.PI * 0.5 + ndx) * this.radius + this.position.y,
                Math.sin(time + Math.PI * 0.5 + ndx) * this.radius + this.position.z
            )
            return;
        }

        if (this.isNotOverPlanet()) {
            this.group.position.set(this.position.x + this.overPlanetX, this.position.y + this.overPlanetY, this.position.z)
        }
    }

    rotateAroundSelf(ndx) {
        const ndxVelocity = ndx / 10 + 1;
        if (this.updateRotation && this.mesh) {
            this.mesh.rotation.y = this.time.elapsed * 0.0001 * this.selfRotationVelocity * ndxVelocity
            this.mesh.rotation.x = this.time.elapsed * 0.0001 * this.selfRotationVelocity * ndxVelocity
        } else {
            this.mesh.rotation.x = this.time.elapsed * 0.0001
        }
    }

    isNotOverPlanet() {
        return this.position.x + this.overPlanetX !== this.group.position.x
            || this.position.y + this.overPlanetY !== this.group.position.y
            || this.position.z !== this.group.position.z
    }

    get overPlanetY() {
        return this.experiance.config.stage.satellite[this.configName].overY ?? 0;
    }

    get overPlanetX() {
        return this.experiance.config.stage.satellite[this.configName].overX ?? 0;
    }

    followCameraOnClicked() {
        this.mouse.on(Mouse.LEFT_ClICK_EVENT, () => {
            if (this.hovered) {
                this.camera.setTarget(this.text.mesh);
            }
        })
        this.mouse.on(Mouse.RIGHT_ClICK_EVENT, () => {
            if (this.hovered) {
                this.camera.clearTarget();
            }
        })
    }

    get hovered() {
        return this.raycaster.intersects.some(intersect => intersect.object.uuid === this.plane.uuid)
    }

    getClickablePlane() {
        const plane =   new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({
                color: 'red',
                transparent: true,
                opacity: 0
            }));
        plane.visible = false
        return plane
    }

}
