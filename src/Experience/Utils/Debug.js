import * as dat from 'lil-gui';

export default class Debug {
    constructor() {
        this.active = window.location.hash === '#debug';
        if (this.active) {
            this.ui = new dat.GUI();
        }
    }

    static getPage(maxPage = Infinity) {
        const page = Number(Debug.getParams('page', 0));
        return Number.isSafeInteger(page) && page >= 0 && page <= maxPage ? page : 0;
    }

    static getControlsEnabled() {
        return Debug.getParams('controls', false) === 'true';
    }

    static getCameraVelocity() {
            return Debug.getParams('camera', 0.3)
    }

    static getModelVelocity() {
            return Debug.getParams('model', 2000)
    }

    static getParams(name, defaultValue) {
        try {
            return new URLSearchParams(window.location.search).get(name) || defaultValue
        } catch (e) {
            return defaultValue;
        }
    }
}
