import * as THREE from "three";

export default class DisposeUtils {
    static dispose(mesh) {
        if (!mesh) {
            return
        }

        if (mesh instanceof THREE.Mesh) {
            if (!mesh.geometry.userData.resourceCache) mesh.geometry.dispose();

            mesh.removeFromParent();
        }
    }
}