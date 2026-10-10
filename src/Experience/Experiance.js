import * as THREE from 'three';
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import World from "./World/World.js";
import Resources from "./Utils/Resources.js";
import sources from './sources.js'
import Debug from "./Utils/Debug.js";
import Mouse from "./Utils/Mouse.js";
import Raycaster from "./Utils/Raycaster.js";

let instance = null;

export default class Experience {
    static get INSTANCE() {
        return new Experience()
    }

    constructor(canvas) {
        if (instance) {
            return instance
        }

        instance = this;

        window.experience = this;

        this.config = window.scenario;
        this.resources = new Resources(sources);
        this.debug = new Debug();
        this.canvas = canvas;
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.mouse = new Mouse();
        this.raycaster = new Raycaster();
        this.renderer = new Renderer();
        this.world = new World();

        this.sizes.on(Sizes.RESIZE_EVENT, this.resize.bind(this))
        this.time.on(Time.TICK_EVENT, this.update.bind(this))
    }

    resize() {
        this.camera?.resize();
        this.renderer?.resize();
    }

    update() {
        this.camera?.update();
        this.world?.update();
        this.raycaster?.update();
        this.renderer?.update();
    }

    destroy() {
        this.sizes.off(Sizes.RESIZE_EVENT)
        this.time.destroy()

        this.scene.traverse((child) => {
            if (child instanceof THREE.Points || child instanceof THREE.Line) {
                child.geometry.dispose();
                child.material.dispose();
            }
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()
                for (const key in child.material) {
                    const value = child.material[key];
                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })
        this.camera.controls.dispose();
        this.renderer.instance.dispose();
        if (this.debug.active) {
            this.debug.ui.destroy()
        }
    }
}
