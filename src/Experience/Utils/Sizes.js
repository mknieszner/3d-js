import EventEmitter from "./EventEmmiter.js";

export default class Sizes extends EventEmitter {
    static RESIZE_EVENT = 'resize';

    constructor() {
        super();

        this.setup();
        window.addEventListener('resize', this.setup.bind(this))
    }

    setup() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);
        this.trigger(Sizes.RESIZE_EVENT)
    }
}