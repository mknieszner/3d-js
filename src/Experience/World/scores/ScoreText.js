import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry.js";

export default class ScoreText {
    generateGeometry(text, size = 1.5) {
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
    }
}