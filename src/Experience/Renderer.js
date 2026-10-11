import * as THREE from 'three';
import Experience from "./Experiance.js";
import {EffectComposer} from "three/addons/postprocessing/EffectComposer.js";
import {RenderPass} from "three/addons/postprocessing/RenderPass.js";
import {OutputPass} from "three/addons/postprocessing/OutputPass.js";
import {UnrealBloomPass} from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import {Vector2} from "three";
import {nextPreparationTurn} from './Utils/StagePreloader.js';

const defaultBloomParams = {
    threshold: 0,
    strength: 0.2,
    radius: 1,
    exposure: 1
}

export default class Renderer {

    constructor() {
        this.bloom = new Bloom();
        this.experiance = Experience.INSTANCE;
        this.canvas = this.experiance.canvas
        this.sizes = this.experiance.sizes
        this.scene = this.experiance.scene
        this.camera = this.experiance.camera
        this.setInstance();
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1
        this.instance.gammaFactor = 2.2
        this.instance.outputColorSpace = THREE.SRGBColorSpace
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setClearColor('#211d20')
        this.preparationScene = new THREE.Scene();
        this.preparationTarget = new THREE.WebGLRenderTarget(1, 1);
        this.preparationMaterial = new THREE.MeshBasicMaterial();
        this.resize();

        const renderPass = new RenderPass(this.scene, this.camera.instance);

        const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = defaultBloomParams.threshold
        bloomPass.strength = defaultBloomParams.strength
        bloomPass.radius = defaultBloomParams.radius

        this.bloomComposer = new EffectComposer(this.instance);
        this.bloomComposer.renderToScreen = false;
        this.bloomComposer.addPass(renderPass)
        this.bloomComposer.addPass(bloomPass);

        const mixPass = new ShaderPass(
            new THREE.ShaderMaterial( {
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
                },
                vertexShader: this.vertexshader,
                fragmentShader: this.fragmentshader,
                defines: {}
            } ), 'baseTexture'
        );
        mixPass.needsSwap = true;

        const outputPass = new OutputPass();
        this.finalComposer = new EffectComposer(this.instance);
        this.finalComposer.addPass(renderPass);
        this.finalComposer.addPass(mixPass);
        this.finalComposer.addPass(outputPass);
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.bloomComposer?.setSize(this.sizes.width, this.sizes.height)
    }

    async prepare(lightGroups = []) {
        const textures = new Set();
        const collect = value => { if (value?.isTexture && !value.isVideoTexture) textures.add(value); };
        Object.values(this.experiance.resources.items).forEach(collect);
        this.scene.traverse(object => {
            for (const material of [object.material].flat()) {
                if (material) Object.values(material).forEach(collect);
            }
        });
        for (const texture of textures) {
            await nextPreparationTurn();
            this.instance.initTexture(texture);
        }

        const visibility = new Map();
        this.scene.traverse(object => visibility.set(object, object.visible));
        // Hidden meshes are also compiled by Three.js. Lights, however, are
        // counted only when visible, so prepare each cockpit/score light variant.
        for (let variant = 0; variant < 2 ** lightGroups.length; variant++) {
            await nextPreparationTurn();
            let normal, bloom;
            try {
                visibility.forEach((_, object) => { object.visible = true; });
                lightGroups.forEach((group, index) => { group.visible = !!(variant & (1 << index)); });
                normal = this.instance.compileAsync(this.scene, this.camera.instance);
                this.scene.traverse(object => this.bloom.nonBloomed(object));
                bloom = this.instance.compileAsync(this.scene, this.camera.instance);
            } finally {
                this.scene.traverse(object => this.bloom.restoreMaterial(object));
                visibility.forEach((visible, object) => { object.visible = visible; });
            }
            await Promise.all([normal, bloom]);
        }

        // Upload buffers for hidden models without drawing them on the canvas.
        const target = new THREE.WebGLRenderTarget(1, 1);
        const previousTarget = this.instance.getRenderTarget();
        const culling = new Map();
        try {
            visibility.forEach((_, object) => { object.visible = true; });
            this.scene.traverse(object => {
                culling.set(object, object.frustumCulled);
                object.frustumCulled = false;
            });
            this.instance.setRenderTarget(target);
            this.instance.render(this.scene, this.camera.instance);
        } finally {
            this.instance.setRenderTarget(previousTarget);
            culling.forEach((value, object) => { object.frustumCulled = value; });
            visibility.forEach((visible, object) => { object.visible = visible; });
            target.dispose();
        }
        this.update();
    }

    prepareGeometry(geometry) {
        const mesh = new THREE.Mesh(geometry, this.preparationMaterial);
        mesh.frustumCulled = false;
        this.preparationScene.add(mesh);
        const target = this.instance.getRenderTarget();
        try {
            this.instance.setRenderTarget(this.preparationTarget);
            this.instance.render(this.preparationScene, this.camera.instance);
        } finally {
            this.instance.setRenderTarget(target);
            this.preparationScene.remove(mesh);
        }
    }

    destroy() {
        this.preparationMaterial.dispose();
        this.preparationTarget.dispose();
        this.instance.dispose();
    }

    update() {
        this.instance.render(this.scene, this.camera.instance)

        this.scene.traverse((obj) => this.bloom.nonBloomed(obj))

        this.bloomComposer?.render();

        this.scene.traverse((obj) => this.bloom.restoreMaterial(obj))

        this.finalComposer?.render();
    }

    get vertexshader() {
       return`
             varying vec2 vUv;
             void main() {
             vUv = uv;
             gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
             }
         `
    }

    get fragmentshader() {
       return`
            uniform sampler2D baseTexture;
            uniform sampler2D bloomTexture;
            
            varying vec2 vUv;
            void main() {
            gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
            }
         `
    }


}

class Bloom {
    constructor() {
        this.BLOOM_SCENE = 1;
        this.layer = new THREE.Layers();
        this.layer.set(this.BLOOM_SCENE);
        this.darkMaterial = new THREE.MeshBasicMaterial({color: 'black'})
        this.matertials = {}
    }

    nonBloomed(obj) {
        if (obj.material && !obj.corpo_bloomed) {
            this.matertials[obj.uuid] = obj.material;
            obj.material = this.darkMaterial;
        }
    }

    restoreMaterial(obj) {
        if (this.matertials[obj.uuid]) {
            obj.material = this.matertials[obj.uuid];
            delete this.matertials[obj.uuid]
        }
    }
}