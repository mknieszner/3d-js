import Experience from "../../../Experiance.js";

export default class FrontingCameraText {
    update() {
        this.mesh?.quaternion.copy(Experience.INSTANCE.camera.instance.quaternion);
    }
}
