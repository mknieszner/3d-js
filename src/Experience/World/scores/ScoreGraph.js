import Experience from "../../Experiance.js";
import * as THREE from "three";
import DisposeUtils from "../../Utils/Dispose.js";
import ScoreGraphDescription from "./ScoreGraphDescription.js";

export default class ScoreGraph {
    group = new THREE.Group();

    constructor(position, lookAtPosition, name) {
        this.name = name;
        this.experiance = Experience.INSTANCE;
        this.position = position;
        this.lookAtPosition = lookAtPosition;

        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.camera = this.experiance.camera;
        this.debug = this.experiance.debug;
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder(name);
            this.debugFolder.close();
        }
    }

    setGeometry(geometryConfig) {
        if (!geometryConfig) {
            return;
        }
        const radius = 5;
        const tube = 1;
        const radialSegments = 10;
        const tubularSegments = 40;

        const redArc = geometryConfig.r.length / 100 * 2 * Math.PI;
        const orangeArc = geometryConfig.o.length / 100 * 2 * Math.PI;
        const yellowArc = geometryConfig.y.length / 100 * 2 * Math.PI;
        const greenArc = geometryConfig.g.length / 100 * 2 * Math.PI;
        const darkGreenArc = geometryConfig.dg.length / 100 * 2 * Math.PI;

        this.redGeometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, redArc);
        this.orangeGeometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, orangeArc);
        this.yellowGeometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, yellowArc);
        this.greenGeometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, greenArc);
        this.darkGreenGometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, darkGreenArc);
    }

    setMaterial(on) {
        this.textMaterial = this.createMaterial('white', on);
        this.redMaterial = this.createMaterial('red', on);
        this.orangeMaterial = this.createMaterial('orange', on);
        this.yellowMaterial = this.createMaterial('yellow', on);
        this.greenMaterial = this.createMaterial('green', on);
        this.darkGreenMaterial = this.createMaterial('darkgreen', on);
    }

    createMaterial(color,  on) {
        return new THREE.MeshBasicMaterial({color, transparent: true, opacity: on ? 1 : 0.2});
    }

    resetMesh(config, text, on) {
        this.dispose();
        const colorsConfig = config;

        if (!colorsConfig) {
            return;
        }

        const ringConfig = {
            dg: {
                start: 0,
                length: colorsConfig.dg,
            },
            g: {
                start: colorsConfig.dg,
                length: colorsConfig.g,
            },
            y: {
                start: colorsConfig.dg + colorsConfig.g,
                length: colorsConfig.y,
            },
            o: {
                start: colorsConfig.dg + colorsConfig.g + colorsConfig.y,
                length: colorsConfig.o,
            },
            r: {
                start: colorsConfig.dg + colorsConfig.g + colorsConfig.y + +colorsConfig.o,
                length: colorsConfig.r,
            },
        }

        this.setGeometry(ringConfig);
        this.setMaterial(on);

        this.textMesh = new ScoreGraphDescription(this.textMaterial, this.position, this.lookAtPosition)
            .resetMesh({description: text});

        this.textMesh.mesh.position.set(0, -8, 0);

        this.redMesh = new THREE.Mesh(
            this.redGeometry,
            this.redMaterial
        );
        this.orangeMesh = new THREE.Mesh(
            this.orangeGeometry,
            this.orangeMaterial
        );
        this.yellowMesh = new THREE.Mesh(
            this.yellowGeometry,
            this.yellowMaterial,
        );
        this.greenMesh = new THREE.Mesh(
            this.greenGeometry,
            this.greenMaterial,
        );
        this.darkGreenMesh = new THREE.Mesh(
            this.darkGreenGometry,
            this.darkGreenMaterial
        );

        this.redMesh.corpo_bloomed = on;
        this.orangeMesh.corpo_bloomed = on;
        this.yellowMesh.corpo_bloomed = on;
        this.greenMesh.corpo_bloomed = on;
        this.darkGreenMesh.corpo_bloomed = on;

        this.redMesh.rotateZ((ringConfig.r.start / 100) * 2 * Math.PI)
        this.orangeMesh.rotateZ(ringConfig.o.start / 100 * 2 * Math.PI)
        this.yellowMesh.rotateZ(ringConfig.y.start / 100 * 2 * Math.PI)
        this.greenMesh.rotateZ(ringConfig.g.start / 100 * 2 * Math.PI)
        this.darkGreenMesh.rotateZ(ringConfig.dg.start / 100 * 2 * Math.PI)

        this.group.add(this.textMesh.mesh);
        this.group.add(this.redMesh);
        this.group.add(this.orangeMesh);
        this.group.add(this.yellowMesh);
        this.group.add(this.greenMesh);
        this.group.add(this.darkGreenMesh);
        this.group.position.set(this.position.x, this.position.y, this.position.z);
        this.group.lookAt(this.lookAtPosition.x, this.position.y, this.lookAtPosition.z);
        this.scene.add(this.group);


        if (this.debug.active) {
            this.debugFolder.add(this.group.position, 'x')
                .name('scx')
                .min(-100).max(100).step(0.001)

            this.debugFolder.add(this.group.position, 'z')
                .name('scz')
                .min(-100).max(100).step(0.001)

            this.debugFolder.add(this.lookAtPosition, 'x')
                .name('lookx')
                .min(-100).max(100).step(0.001).onChange((x) => {
                this.group.lookAt(x, this.position.y, this.lookAtPosition.z);
            });

            this.debugFolder.add(this.lookAtPosition, 'z')
                .name('lookz')
                .min(-100).max(100).step(0.001).onChange((z) => {
                this.group.lookAt(this.lookAtPosition.x, this.position.y, z);
            });
        }
    }

    dispose() {
        this.group.remove(this.textMesh);
        this.group.remove(this.redMesh);
        this.group.remove(this.orangeMesh);
        this.group.remove(this.yellowMesh);
        this.group.remove(this.greenMesh);
        this.group.remove(this.darkGreenMesh);

        DisposeUtils.dispose(this.textMesh);
        DisposeUtils.dispose(this.redMesh);
        DisposeUtils.dispose(this.orangeMesh);
        DisposeUtils.dispose(this.yellowMesh);
        DisposeUtils.dispose(this.greenMesh);
        DisposeUtils.dispose(this.darkGreenMesh);

        Experience.INSTANCE.scene.remove(this.group);
    }
}