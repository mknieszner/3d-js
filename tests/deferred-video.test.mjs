import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import VideoPlane from '../src/Experience/World/planes/VideoPlane.js';

function fixture() {
    const videos = Object.fromEntries(['zombie-video', 'conflict-video', 'congrats-video'].map(id => {
        const source = {
            dataset: {src: `./video/${id}.mp4`},
            src: null,
            hasAttribute() { return this.src !== null; },
            setAttribute(name, value) { this[name] = value; },
        };
        return [id, {
            source, loads: 0, plays: 0, pauses: 0,
            querySelector() { return source; },
            load() { this.loads++; },
            play() { this.plays++; return Promise.resolve(); },
            pause() { this.pauses++; },
        }];
    }));
    const plane = Object.assign(Object.create(VideoPlane.prototype), {
        experiance: {config: {stage: {description: {video: {on: false}}}}},
        group: {visible: false},
        getVideo: id => videos[id],
        setTextures() {}, setGeometry() {}, setMaterial() {}, setMesh() {},
    });
    return {plane, videos};
}

test('initial HTML defers every movie and uses a CSS loader', async () => {
    const html = await readFile(new URL('../src/index.html', import.meta.url), 'utf8');
    const tags = html.match(/<video\b[^>]*>/g);
    assert.equal(tags.length, 3);
    for (const tag of tags) assert.match(tag, /preload="none"/);
    const sources = html.match(/<source\b[^>]*>/g);
    assert.equal(sources.length, 3);
    for (const source of sources) {
        assert.match(source, /data-src="[^\"]+\.mp4"/);
        assert.doesNotMatch(source, /\ssrc=/);
    }
    assert.doesNotMatch(html, /loader\.gif/);
    assert.match(html, /class="loader-spinner"/);
});

test('movies stay unloaded until their stage and reuse their source on return', () => {
    const {plane, videos} = fixture();
    const select = video => {
        plane.experiance.config.stage.description.video = video;
        plane.setConfig();
    };
    select({on: false});
    assert(Object.values(videos).every(video => video.loads === 0 && video.plays === 0));
    select({on: true, name: 'zombie-video'});
    assert.equal(videos['zombie-video'].loads, 1);
    assert.equal(videos['zombie-video'].source.src, './video/zombie-video.mp4');
    assert.equal(videos['conflict-video'].loads, 0);
    assert.equal(videos['congrats-video'].loads, 0);
    assert.equal(plane.group.visible, true);
    select({on: true, name: 'conflict-video'});
    assert.equal(videos['conflict-video'].loads, 1);
    assert(videos['zombie-video'].pauses > 0);
    select({on: false});
    assert.equal(plane.group.visible, false);
    select({on: true, name: 'zombie-video'});
    assert.equal(videos['zombie-video'].loads, 1);
    assert.equal(videos['zombie-video'].plays, 2);
    assert.equal(videos['congrats-video'].loads, 0);
});

test('aborted playback and browser autoplay restrictions are handled', async () => {
    const {plane, videos} = fixture();
    plane.videoName = 'zombie-video';
    for (const name of ['AbortError', 'NotAllowedError']) {
        videos['zombie-video'].play = () => Promise.reject(Object.assign(new Error(name), {name}));
        plane.play();
        await new Promise(resolve => setImmediate(resolve));
    }
});

test('a blocked direct-link movie retries after a gesture and cancels the retry when leaving', async () => {
    const originalDocument = globalThis.document;
    globalThis.document = new EventTarget();
    try {
        const {plane, videos} = fixture();
        const video = videos['congrats-video'];
        plane.videoOn = true;
        plane.videoName = 'congrats-video';
        video.play = () => {
            video.plays++;
            return video.plays === 1
                ? Promise.reject(Object.assign(new Error('Autoplay blocked'), {name: 'NotAllowedError'}))
                : Promise.resolve();
        };
        plane.play();
        await new Promise(resolve => setImmediate(resolve));
        assert.equal(typeof plane.retryPlayback, 'function');
        document.dispatchEvent(new Event('pointerdown'));
        assert.equal(video.plays, 2);
        assert.equal(video.loads, 1);
        assert.equal(plane.retryPlayback, null);
        document.dispatchEvent(new Event('keydown'));
        assert.equal(video.plays, 2);

        plane.waitForInteraction();
        plane.videoOn = false;
        plane.pauseAll();
        document.dispatchEvent(new Event('pointerdown'));
        assert.equal(video.plays, 2);
    } finally {
        globalThis.document = originalDocument;
    }
});
