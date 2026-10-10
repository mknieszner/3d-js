import EventEmitter from "./EventEmmiter.js";

export default class Time extends EventEmitter {
    static TICK_EVENT = 'tick';
    static FRAME_DURATION = 1000 / 60;
    static MAX_DELTA = 100;

    constructor() {
        super();
        this.current = null;
        this.elapsed = 0;
        this.delta = 0;
        this.tick = this.tick.bind(this);
        this.resetFrame = this.resetFrame.bind(this);
        document.addEventListener('visibilitychange', this.resetFrame);
        this.frame = window.requestAnimationFrame(this.tick);
    }

    // Preserve the old animation speeds at 60 FPS, without tying them to FPS.
    get frameScale() {
        return this.delta / Time.FRAME_DURATION;
    }

    damping(alphaAt60Fps) {
        const alpha = Math.min(1, Math.max(0, alphaAt60Fps));
        return 1 - Math.pow(1 - alpha, this.frameScale);
    }

    resetFrame() {
        this.current = null;
        this.delta = 0;
    }

    tick(timestamp) {
        this.frame = window.requestAnimationFrame(this.tick);
        if (document.hidden) {
            this.resetFrame();
            return;
        }

        // RAF supplies a monotonic timestamp. Cap stalls, and exclude hidden time
        // from both incremental motion and animations based on total elapsed time.
        this.delta = this.current === null ? 0 : Math.min(Math.max(timestamp - this.current, 0), Time.MAX_DELTA);
        this.current = timestamp;
        this.elapsed += this.delta;
        this.trigger(Time.TICK_EVENT);
    }

    destroy() {
        window.cancelAnimationFrame(this.frame);
        document.removeEventListener('visibilitychange', this.resetFrame);
        this.off(Time.TICK_EVENT);
    }
}
