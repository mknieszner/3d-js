import Experience from "../../Experiance.js";
import * as THREE from "three";

const NeonColor = 0x00B0D1

const defaultConfig = {
    radius: 4.0
}
export default class ActorHologramRound {
    targetScale = 0;


    constructor(config) {
        this.config = {
            ...defaultConfig,
            ...config
        }
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.camera = this.experiance.camera;

        this.setGeometry();
        this.setTextures();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.atomGeometry = new THREE.IcosahedronGeometry(this.config.radius, 10);
        this.atomGeometry.scale(1.6, 1.3, 1);
        this.atomGeometry.rotateZ(Math.PI/2);

        this.bondGeometry = new THREE.IcosahedronGeometry(this.config.radius, 10);
        this.bondGeometry.scale(1.6, 1.3, 1);
        this.bondGeometry.rotateZ(Math.PI/2);
        addCenterAttribute(this.bondGeometry);
    }

    setTextures() {

    }

    setMaterial() {
        this.atomMaterial = new THREE.PointsMaterial({
            size: 0.1,
            color: NeonColor,
            // side: THREE.BackSide
        });
        this.bondMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader(),
            fragmentShader: fragmentShader(),
            // side: THREE.BackSide,
            transparent: true
        });
    }

    setMesh() {
        this.group = new THREE.Group();

        const spherePoints = new THREE.Points(this.atomGeometry, this.atomMaterial);
        spherePoints.corpo_bloomed = true;
        // this.group.add(spherePoints);

        const sphereLines = new THREE.Mesh(this.bondGeometry, this.bondMaterial);
        sphereLines.corpo_bloomed = true;
        // this.group.add(sphereLines);
    }

    update() {
        if (!this.group) {
            return
        }
        this.group.rotation.y += 0.05 * this.experiance.time.frameScale;
    }


}


function vertexShader() {
    return `
    attribute vec3 center;
    varying vec3 vCenter;
      
    void main() {
      vCenter = center;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
    }
  `;
}

function fragmentShader() {
    return `
    varying vec3 vCenter;

    void main() {
      if (vCenter.x > 0.02 && vCenter.y > 0.02 && vCenter.z > 0.02) {
        discard;
      } else {
        if (vCenter.x < 0.02 && (vCenter.y < 0.25 || vCenter.z < 0.25)) {
          discard;
        }
        if (vCenter.y < 0.02 && (vCenter.x < 0.25 || vCenter.z < 0.25)) {
          discard;
        }
        if (vCenter.z < 0.02 && (vCenter.y < 0.25 || vCenter.x < 0.25)) {
          discard;
        }
      }
	    gl_FragColor = vec4(0.77, 0.90 ,1.0 , 0.2);
    }
  `;
}

function addCenterAttribute(geometry) {
    const vectors = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 1)
    ];

    const position = geometry.attributes.position;
    const centers = new Float32Array(position.count * 3);

    for (let i = 0, l = position.count; i < l; i++) {
        vectors[i % 3].toArray(centers, i * 3);
    }

    geometry.setAttribute("center", new THREE.BufferAttribute(centers, 3));
}
