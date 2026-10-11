import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry.js";
import {textGeometryKey} from '../../Utils/GeometryCache.js';

export default class ScoreText {
    generateGeometry(text, size = 1.5) {
        return this.resources.geometryCache.get(textGeometryKey('score', text, size), () => {
            const geometry = new TextGeometry(text, {
                font: this.resources.items.kenpixel_ttf,
                size,
                height: 0.5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            })
            geometry.computeBoundingBox()
            geometry.translate(
                -geometry.boundingBox.max.x * 0.5,
                -geometry.boundingBox.max.y * 0.5,
                -geometry.boundingBox.max.z * 0.5
            )
            return geometry;
        });
    }
}
