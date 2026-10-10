import * as THREE from 'three';
import Experience from "./Experiance.js";
import {EffectComposer} from "three/addons/postprocessing/EffectComposer.js";
import {RenderPass} from "three/addons/postprocessing/RenderPass.js";
import {OutputPass} from "three/addons/postprocessing/OutputPass.js";
import {UnrealBloomPass} from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import {Vector2} from "three";

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
        if (!obj.corpo_bloomed) {
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