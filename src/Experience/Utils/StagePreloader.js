import Scenario from '../Scenario/Scenario.js';
import ScoreText from '../World/scores/ScoreText.js';
import {textGeometryKey} from './GeometryCache.js';

export const nextPreparationTurn = () => new Promise(resolve => {
    if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(resolve, {timeout: 200});
    } else {
        setTimeout(resolve, 16);
    }
});

export default class StagePreloader {
    constructor(experience, description) {
        this.experience = experience;
        this.description = description;
        this.scoreText = Object.assign(new ScoreText(), {resources: experience.resources});
        this.generation = 0;
        experience.config.on(`${Scenario.CHAPTER_CHANGE}.preloader`, () => {
            this.prepare().catch(error => console.warn('Przygotowanie etapu nie powiodło się:', error));
        });
    }

    jobsFor(stage) {
        const jobs = new Map();
        for (const [index, line] of (stage.description?.content ?? []).entries()) {
            const big = index === 0 && this.description.firstBig;
            jobs.set(textGeometryKey('description', line, big ? 1 : 0.6),
                () => this.description.generateGeometry(line, big));
        }
        const scores = stage.texts?.scores;
        for (const data of [scores?.data1, scores?.data2, scores?.data3]) {
            for (const [text, size] of [[data?.title, 1.5], [data?.description, data?.descriptionSize ?? 0.8]]) {
                if (text) jobs.set(textGeometryKey('score', text, size),
                    () => this.scoreText.generateGeometry(text, size));
            }
        }
        if (scores?.graph) {
            for (const text of ['BEFORE', 'AFTER']) {
                jobs.set(textGeometryKey('score', text, 1), () => this.scoreText.generateGeometry(text, 1));
            }
        }
        return jobs;
    }

    async prepare() {
        const generation = ++this.generation;
        const jobs = new Map();
        // The active stage and one previous stage remain cached for back navigation.
        for (const offset of [0, 1, 2, -1]) {
            const stage = this.experience.config.steps[this.experience.config.step + offset];
            if (stage) for (const [key, job] of this.jobsFor(stage)) jobs.set(key, job);
        }
        const cache = this.experience.resources.geometryCache;
        cache.retain(new Set(jobs.keys()));
        for (const [key, job] of jobs) {
            if (cache.items.has(key)) continue;
            await nextPreparationTurn();
            if (generation !== this.generation) return;
            const geometry = job();
            this.experience.renderer?.prepareGeometry(geometry);
        }
    }

    destroy() {
        this.generation++;
        this.experience.config.off(`${Scenario.CHAPTER_CHANGE}.preloader`);
    }
}
