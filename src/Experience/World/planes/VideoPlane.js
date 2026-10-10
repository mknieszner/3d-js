import Experience from "../../Experiance.js";
import * as THREE from "three";
import Scenario from "../../Scenario/Scenario.js";
import {RectangleRounded} from "../../Utils/RectangleRounded.js";
import {Color} from "three";

export default class VideoPlane {
    constructor(config = {
        borderMaterial: null,
    }) {
        this.config = config;
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.debug = this.experiance.debug;

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Video');
            this.debugFolder.close();
        }

        this.setGeometry();
        this.setTextures();
        this.setMaterial();
        this.setBorderMaterial();
        this.setMesh();
        this.setVideo();

        this.watchConfig();
    }

    setGeometry(width = 30, height= 20) {
        this.geometry = new RectangleRounded(width, height, 2, 10);
        this.borderGeometry = new RectangleRounded(width + 1,height + 1, 2, 10);
    }

    setTextures(name) {
        this.textures = {}
        this.textures.color = new THREE.VideoTexture(this.getVideo(name || this.videoNames[0]));
        this.textures.color.colorSpace = THREE.SRGBColorSpace
    }

    setMaterial() {
        this.material = new THREE.MeshBasicMaterial({
            map: this.textures.color
        });
    }

    setBorderMaterial() {
        this.borderMaterial = this.config.borderMaterial;
    }

    setMesh() {
        this.oldGroup = this.group;
        this.group = new THREE.Group()

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.group.add(this.mesh);

        this.border = new THREE.Mesh(this.borderGeometry, this.borderMaterial)
        this.border.corpo_bloomed = true
        this.border.position.z = -0.05;
        this.group.add(this.border);

        this.group.position.z = 15;

        this.scene.remove(this.oldGroup);
        this.scene.add(this.group);
    }

    watchConfig() {
        this.setConfig()
        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => this.setConfig())
    }

    setConfig() {
        this.videoOn = this.experiance.config.stage.description.video.on;
        this.videoName = this.experiance.config.stage.description.video.name;
        this.width = this.experiance.config.stage.description.video.width;
        this.height = this.experiance.config.stage.description.video.height;

        this.pauseAll();
        if(this.videoOn) {
            this.setTextures(this.videoName);
            this.setGeometry(this.width, this.height);
            this.setMaterial();
            this.setMesh();
        }

        this.update()
    }

    update() {
        if (this.videoOn && !this.group.visible) {
            this.group.visible = true;
        }

        if (this.videoOn) {
            this.play();
        } else {
            this.group.visible = false;
            this.pauseAll();
        }
    }

    play() {
        const video = this.getVideo(this.videoName);
        if (!video) return;

        const source = video.querySelector('source[data-src]');
        if (source && !source.hasAttribute('src')) {
            source.setAttribute('src', source.dataset.src);
            video.load();
        }
        // A fast chapter change may abort a pending play; direct links may also
        // require a user gesture before the browser permits sound.
        video.play()?.catch(error => {
            if (error.name === 'NotAllowedError' && this.videoOn && this.getVideo(this.videoName) === video) {
                this.waitForInteraction();
            }
            if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
                console.warn('Nie udało się odtworzyć filmu:', error);
            }
        });
    }

    waitForInteraction() {
        if (this.retryPlayback) return;
        this.retryPlayback = () => {
            this.clearPlaybackRetry();
            if (this.videoOn) this.play();
        };
        document.addEventListener('pointerdown', this.retryPlayback, {once: true});
        document.addEventListener('keydown', this.retryPlayback, {once: true});
    }

    clearPlaybackRetry() {
        if (!this.retryPlayback) return;
        document.removeEventListener('pointerdown', this.retryPlayback);
        document.removeEventListener('keydown', this.retryPlayback);
        this.retryPlayback = null;
    }

    pauseAll() {
        this.clearPlaybackRetry();
        this.videoNames.map(videoName => this.getVideo(videoName)?.pause());
    }

    setVideo() {
        this.videoNames.map(videoName => {
            this.getVideo(videoName).addEventListener( 'play', function () {
                this.currentTime = 0;
            }, false );
        })
    }

    getVideo(videoId) {
        return document.getElementById(videoId)
    }

    get videoNames() {
        return ['zombie-video', 'conflict-video', 'congrats-video'];
    }

}
