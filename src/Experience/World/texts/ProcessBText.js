import Experience from "../../Experiance.js";
import * as THREE from 'three';
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry.js";
import Scenario from "../../Scenario/Scenario.js";
import DefaultText from "./DefaultText.js";

export default class ProcessBText extends DefaultText {
    targetScale = 0;

    constructor() {
        super();
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.setGeometry();
        this.setTextures();
        this.setMaterial();
        this.setMesh();

        this.watchConfig();
    }

    setGeometry() {
        this.geometry = this.generateGeometry('PROCES B', 0.4)
        this.subGeometries = this.generateSubGeometry()
    }

    setTextures() {
        this.textures = {}
        this.textures.color = this.resources.items.textureOrangeRing;
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.anisotropy = 16
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({map: this.textures.color})
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.subMeshes = this.subGeometries.map(item => {
            const mesh = new THREE.Mesh(item.geometry, this.material);
            mesh.position.set(item.position.x, item.position.y, item.position.z)
            return mesh;
        });
        this.group = new THREE.Group();
        this.group.add(this.mesh)
        this.subMeshes.map(mesh => this.group.add(mesh))
        this.group.scale.set(0, 0, 0);

        this.scene.add(this.group)
    }

    watchConfig() {
        this.targetScale = this.experiance.config.stage.texts.processB.scale;

        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => {
            this.targetScale = this.experiance.config.stage.texts.processB.scale;
        })
    }

    update() {
        this.updateScale();
    }

    get scaleMesh() {
        return this.group;
    }

    generateSubGeometry() {
        return  ['DOMAIN 1', 'DOMAIN 2', 'DOMAIN 3'].map((line, ndx, array) => {
            return {
                geometry: this.generateGeometry(line, 0.3),
                position: {x: 0,y: -(ndx * 0.6) - 1, z: 0}
            }
        })
    }

    generateGeometry(line, size = 0.6) {
        const geometry = new TextGeometry(line, {
            font: this.resources.items.kenpixel_ttf,
            size: size,
            height: 0.05,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        })
        geometry.computeBoundingBox()
        geometry.translate(
            - geometry.boundingBox.max.x * 0.5,
            - geometry.boundingBox.max.y * 0.5,
            - geometry.boundingBox.max.z * 0.5
        )
        return geometry;
    }
}
