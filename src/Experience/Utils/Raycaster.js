import Experience from "../Experiance.js";
import * as THREE from "three";
import EventEmitter from "./EventEmmiter.js";

export default class Raycaster extends EventEmitter {
    static ON_HOVER_EVENT = 'hover'

    constructor() {
        super();
        this.experience = Experience.INSTANCE;
        this.camera = this.experience.camera;
        this.mouse = this.experience.mouse;
        this.instance = new THREE.Raycaster()
        this.intersects = [];
    }

    update() {
        this.instance.setFromCamera(this.mouse.instance, this.camera.instance)
        const objects = []
        if (this.experience.world.mainNucleus?.nucleus) {
            objects.push(this.experience.world.mainNucleus?.nucleus)
        }
        if (this.experience.world.dracoTeam?.plane) {
            objects.push(this.experience.world.dracoTeam?.plane)
        }
        if (this.experience.world.geminiTeam?.plane) {
            objects.push(this.experience.world.geminiTeam?.plane)
        }
        if (this.experience.world.aquariusTeam?.plane) {
            objects.push(this.experience.world.aquariusTeam?.plane)
        }
        if (this.experience.world.taurusTeam?.plane) {
            objects.push(this.experience.world.taurusTeam?.plane)
        }
        this.intersects = this.instance.intersectObjects(objects);
    }
}