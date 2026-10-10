import * as THREE from "three";
import DefaultNucleus from "./DefaultNucleus.js";
import Scenario from "../../Scenario/Scenario.js";
import Mouse from "../../Utils/Mouse.js";

export default class MainNucleus extends DefaultNucleus {
    blobScale = 0.15
    maxScale = 5
    minScale = 1.5
    configName = 'main';

    constructor() {
        super();
        this.mouse = this.experiance.mouse;
        this.setGeometry(64);
        this.setTextures('mainNucleus');
        this.setMaterial();
        this.setMesh();

        this.watchClicked();
        this.watchConfig();
    }

    setTextures(textureName) {
        this.textures = {}
        this.textures.color = this.resources.items[textureName];
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.inside = this.resources.items[textureName];
        this.textures.inside.colorSpace = THREE.SRGBColorSpace
        this.textures.colorNormalMap = this.resources.items[textureName + 'Normal'];
        this.textures.colorAoMap = this.resources.items[textureName + 'AoMap'];
        this.textures.colorDisplacementMap = this.resources.items[textureName];
        this.textures.colorMetalnessMap = this.resources.items[textureName + 'Metalness'];
        this.textures.colorRoughnessMap = this.resources.items[textureName + 'Roughness'];
        Object.keys(this.textures).forEach(key => {
            this.textures[key].repeat.x = 4
            this.textures[key].repeat.y = 4
            this.textures[key].wrapS = THREE.RepeatWrapping
            this.textures[key].wrapT = THREE.RepeatWrapping
        })
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
            aoMap: this.textures.colorAoMap,
            aoMapIntensity: 1,
            emissiveMap: this.textures.colorDisplacementMap,
            emissiveIntensity: 1,
            metalnessMap: this.textures.colorMetalnessMap,
            roughnessMap: this.textures.colorRoughnessMap,
            normalMap: this.textures.colorNormalMap
        });
        this.material.metalness = 0.1
        this.material.minFilter = THREE.NearestFilter
        this.material.magFilter = THREE.NearestFilter
    }

    setMesh() {
        super.setMesh()
        this.scene.add(this.nucleus);
    }

    watchConfig() {
        this.targetScale = this.experiance.config.stage.nucleus.main.scale;

        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => {
            this.targetScale = this.experiance.config.stage.nucleus.main.scale;
        })
    }

    update() {
        if (!this.nucleus) {
            return
        }

        super.update();
    }

    watchClicked() {
        this.mouse.on(Mouse.LEFT_ClICK_EVENT, () => {
            if (this.hovered && this.maxScale >= this.targetScale) {
                this.targetScale = this.targetScale * 1.2;
                this.blobScale += 0.05
            }
        })
        this.mouse.on(Mouse.RIGHT_ClICK_EVENT, () => {
            if (this.hovered && this.minScale <= this.targetScale) {
                this.targetScale = this.targetScale / 1.2;
                this.blobScale -= 0.05
            }
        })
    }
}

