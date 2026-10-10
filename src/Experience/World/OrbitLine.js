import * as THREE from 'three';

export default class OrbitLine extends THREE.LineLoop {
    constructor(color, path) {
        const sampleCount = 256;
        const positions = new Float32Array(sampleCount * 3);
        const point = new THREE.Vector3();
        for (let i = 0; i < sampleCount; i++) {
            path.getPoint(i * Math.PI * 2 / sampleCount, point).toArray(positions, i * 3);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.LineBasicMaterial({
            color,
            linewidth: 1,
            transparent: true,
            opacity: 0.5,
            depthWrite: false,
            toneMapped: false,
        });

        super(geometry, material);
        this.baseOpacity = material.opacity;
        this.visible = false;
        this.corpo_bloomed = true;
    }

    setOrbit(radius, center) {
        this.scale.setScalar(radius);
        this.position.set(center.x, center.y, center.z);
    }
}
