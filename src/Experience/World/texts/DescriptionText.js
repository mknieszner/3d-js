import Experience from "../../Experiance.js";
import * as THREE from 'three';
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry.js";
import Scenario from "../../Scenario/Scenario.js";
import {NeonColors} from "../models/Actor.js";
import {textGeometryKey} from '../../Utils/GeometryCache.js';

export default class DescriptionText {
    geometries = []
    meshes = []

    constructor(config, startX = -2, startY = 6, z = 10, configName = 'description', firstBig = true) {
        this.configName = configName;
        this.config = {
            isTexture: true,
            textureName: 'textureBrownRing',
            ...config
        };
        this.firstBig = firstBig;
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.debug = this.experiance.debug;
        this.startX = startX;
        this.startY = startY;
        this.z = z;
        this.group = new THREE.Group();

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('descriptionText');
            this.debugFolder.close();
        }

        this.setConfig()

        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => this.setConfig())
    }

    setConfig() {
        const content = this.experiance.config.stage[this.configName].content;
        if (JSON.stringify(content) === JSON.stringify(this.content)) return;
        this.content = [...content];
        this.color = this.experiance.config.stage[this.configName].color;
        this.setGeometry();
        this.setTextures();
        // this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.geometries = this.content.map((line, ndx, array) => {
            const rowBigger = ndx === 0 && this.firstBig;
            const y = rowBigger
                ? this.startY + 2
                : this.startY - ndx * 1;

            return {
                geometry: this.generateGeometry(line, rowBigger),
                position: {x: this.startX, y, z: this.z}
            }
        })
    }

    setTextures() {
        this.textures = {}
        this.textures.color = this.resources.items[this.config.textureName];
        this.textures.color.colorSpace = THREE.SRGBColorSpace
    }

    setMaterial() {
        this.material = new THREE.MeshPhysicalMaterial({
            map: this.config.isTexture ? this.textures.color : undefined,
            color: NeonColors.DEFAULT.MAIN,
            opacity: 0.1,
            transparent: true,
        });

        this.wireframeMaterial = new THREE.MeshPhysicalMaterial({
            map: this.config.isTexture ? this.textures.color : undefined,
            color: NeonColors.DEFAULT.FRAME,
            opacity: 1,
            transparent: true,
            wireframe: true
        });

        this.material.needsUpdate = true

        if (this.debug.active) {
            this.debugFolder.add(this.material, 'opacity')
                .name('textOpacity')
                .min(0).max(1).step(0.0001)
            this.debugFolder.add(this.wireframeMaterial, 'opacity')
                .name('wireframeTextOpacity')
                .min(0).max(1).step(0.0001)
        }

    }

    setMesh() {
        this.resetMeshes();
    }

    resetMeshes() {
        this.meshes.forEach(mesh => this.group.remove(mesh))

        this.meshes = [
            ...this.geometries.map(item => {
                const mesh = new THREE.Mesh(item.geometry, this.config.material);
                mesh.corpo_bloomed = true
                mesh.position.set(item.position.x, item.position.y, item.position.z)
                // const wireframeMesh = new THREE.Mesh(item.geometry, this.config.material);
                // wireframeMesh.corpo_bloomed = true
                // mesh.add(wireframeMesh)
                return mesh;
            })
        ]

        this.meshes.forEach(mesh => this.group.add(mesh));
    }


    generateGeometry(content, isBigger) {
        const size = isBigger ? 1 : 0.6;
        return this.resources.geometryCache.get(textGeometryKey('description', content, size), () => {
            const geometry = new TextGeometry(content, {
                font: this.resources.items.kenpixel_ttf,
                size,
                height: 0.1,
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
