import * as THREE from 'three';
import Experience from "./Experiance.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import Scenario from "./Scenario/Scenario.js";
import Debug from "./Utils/Debug.js";

export default class Camera {
    updating = true
    targetItem = null
    targetPosition = {
        x: 0,
        y: 0,
        z: 15
    }

    constructor() {
        this.experience = Experience.INSTANCE;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.time = this.experience.time;
        this.setInstance();
        this.setOrbitControls();
        this.watchConfig();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 1000)
        this.scene.add(this.instance)
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enabled = Debug.getControlsEnabled();
        this.controls.maxDistance = 300;
        this.controls.minDistance = 3.4;
        this.controls.enablePan = true;
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    watchConfig() {
        this.setConfig()
        this.experience.config.on(Scenario.CHAPTER_CHANGE, () => this.setConfig())
    }

    setConfig() {
        this.targetPosition = this.experience.config.stage.camera.position;
        this.velocity = this.experience.config.stage.camera.velocity || 0.03;
        if(!this.rotateRadius && this.experience.config.stage.camera.rotateRadius) {
            this.rotateStart = this.time.elapsed;
        }
        this.rotateRadius = this.experience.config.stage.camera.rotateRadius;

        // this.locked = this.experience.config.stage.camera.locked;
        this.locked = false;
        this.updating = true;
        this.targetItem = null;
    }


    update() {
        this.updatePosition();
        this.controls.update();
    }

    updatePosition() {
        // console.log(this.instance.position)

        if (this.rotateRadius) {
            const time = (this.time.elapsed - this.rotateStart) * 0.00025;
            this.instance.position.set(
                Math.cos(time + Math.PI * 0.5) * this.rotateRadius,
                0,
                Math.sin(time + Math.PI * 0.5) * this.rotateRadius
            )
            return
        }

        if (this.targetItem) {
            return this.followTarget(this.targetItem);
        }

        if (!this.updating && !this.locked) {
            return
        }

        const velocity = this.time.damping(this.velocity);

        const deltaX = (this.targetPosition.x - this.instance.position.x);
        const deltaY = (this.targetPosition.y - this.instance.position.y);
        const deltaZ = (this.targetPosition.z - this.instance.position.z);

        // if(Math.abs(deltaX) < 5 && Math.abs(deltaY) < 5 && Math.abs(deltaZ) < 5) {
        //     velocity = this.velocity * 3
        // }

        if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5 || Math.abs(deltaZ) > 0.5) {
            this.instance.position.set(
                this.instance.position.x + deltaX * velocity,
                this.instance.position.y + deltaY * velocity,
                this.instance.position.z + deltaZ * velocity
            )
            this.instance.updateProjectionMatrix();
        } else {
            this.instance.position.set(this.targetPosition.x, this.targetPosition.y, this.targetPosition.z);
            this.updating = false;
        }
    }

    followTarget(objectToFollow) {
        const objectToFollowPosition = new THREE.Vector3();
        objectToFollow.getWorldPosition(objectToFollowPosition);

        let velocity = 20;
        const thresholdVelocity = 5;
        const threshold = 0.07;
        const distanceMultiplier = 2;

        const targetPosition = {
            x: objectToFollowPosition.x * distanceMultiplier,
            y: objectToFollowPosition.y * distanceMultiplier,
            z: objectToFollowPosition.z * distanceMultiplier
        };

        const distanceX = (targetPosition.x - this.instance.position.x)
        const distanceY = (targetPosition.y - this.instance.position.y)
        const distanceZ = (targetPosition.z - this.instance.position.z)

        if (distanceY < 3 && distanceX < 3 && distanceZ < 3) {
            velocity = thresholdVelocity;
        }

        const damping = this.time.damping(1 / velocity);
        const deltaX = distanceX * damping;
        const deltaY = distanceY * damping;
        const deltaZ = distanceZ * damping;

        // Check distance, not this frame's step size (which varies with FPS).
        if (Math.abs(distanceX) > threshold * velocity || Math.abs(distanceY) > threshold * velocity || Math.abs(distanceZ) > threshold * velocity) {
            this.instance.position.set(
                this.instance.position.x + deltaX,
                this.instance.position.y + deltaY,
                this.instance.position.z + deltaZ
            )
        } else {
            this.instance.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
            this.updating = false;
            this.locked = false;
        }

        this.instance.updateProjectionMatrix();
    }

    setTarget(targetItem) {
        if (!this.controls.enabled) {
            return;
        }
        this.targetItem = targetItem;
    }

    clearTarget() {
        if (!this.controls.enabled) {
            return;
        }
        this.targetItem = null
        this.updating = false;
        this.locked = false;
    }
}
