import * as THREE from "three";
import Experience from "../Experiance.js";

export default class DisposeUtils {
    static dispose(mesh) {
        if (!mesh) {
            return
        }

        if (mesh instanceof THREE.Mesh) {
            mesh.geometry.dispose()
            for (const key in mesh.material) {
                const value = mesh.material[key];
                if (value && typeof value.dispose === 'function') {
                    value.dispose()
                }
            }

            Experience.INSTANCE.scene.remove(mesh)
        }
    }
}