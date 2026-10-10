import * as THREE from 'three';

export default class DottedOrbit extends THREE.Points {
    constructor(color, {tilted = false, dotCount = 128, dotOffset = 0} = {}) {
        const positions = new Float32Array(dotCount * 3);
        for (let i = 0; i < dotCount; i++) {
            const angle = (i + dotOffset) * Math.PI * 2 / dotCount;
            positions[i * 3] = Math.cos(angle);
            positions[i * 3 + 1] = tilted ? Math.sin(angle) : 0;
            positions[i * 3 + 2] = Math.sin(angle);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
            color,
            size: 2.5,
            sizeAttenuation: false,
            transparent: true,
            opacity: 0.6,
            depthWrite: false,
            toneMapped: false,
        });
        material.onBeforeCompile = shader => {
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_particle_fragment>',
                `#include <map_particle_fragment>
                float dotDistance = length(gl_PointCoord - vec2(0.5));
                diffuseColor.a *= 1.0 - smoothstep(0.3, 0.5, dotDistance);`
            );
        };

        super(geometry, material);
        this.visible = false;
        this.corpo_bloomed = true;
    }

    setOrbit(radius, center) {
        this.scale.setScalar(radius);
        this.position.set(center.x, center.y, center.z);
    }
}
