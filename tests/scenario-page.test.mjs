import assert from 'node:assert/strict';
import test from 'node:test';
import Scenario from '../src/Experience/Scenario/Scenario.js';
import {SCORES_STEPS} from '../src/Experience/Scenario/ScoresScenario.js';
import {HISTORY_STEPS} from '../src/Experience/Scenario/HistoryScenario.js';

const steps = SCORES_STEPS.concat(HISTORY_STEPS);

function scenarioAt(search) {
    const originalWindow = globalThis.window;
    globalThis.window = {location: {search, hash: ''}};
    try {
        return new Scenario();
    } finally {
        if (originalWindow === undefined) {
            delete globalThis.window;
        } else {
            globalThis.window = originalWindow;
        }
    }
}

test('a page URL starts at the requested stage and supports next and previous', () => {
    const scenario = scenarioAt('?page=5');
    const changes = [];
    scenario.on(Scenario.CHAPTER_CHANGE, () => changes.push(scenario.step));

    assert.equal(scenario.step, 5);
    assert.equal(scenario.stage, steps[5]);
    scenario.next();
    assert.equal(scenario.step, 6);
    assert.equal(scenario.stage, steps[6]);
    scenario.prev();
    assert.equal(scenario.step, 5);
    assert.equal(scenario.stage, steps[5]);
    assert.deepEqual(changes, [6, 5]);
});

test('page URLs preserve the first and last stage navigation boundaries', () => {
    const first = scenarioAt('?page=0');
    first.prev();
    assert.equal(first.step, 0);
    assert.equal(first.stage, steps[0]);
    first.next();
    assert.equal(first.step, 1);
    assert.equal(first.stage, steps[1]);

    const lastPage = steps.length - 1;
    const last = scenarioAt(`?page=${lastPage}`);
    last.next();
    assert.equal(last.step, lastPage);
    assert.equal(last.stage, steps[lastPage]);
    last.prev();
    assert.equal(last.step, lastPage - 1);
    assert.equal(last.stage, steps[lastPage - 1]);
});

test('missing, invalid and out-of-range pages fall back to a navigable first stage', () => {
    for (const search of [
        '', '?page=', '?page=abc', '?page=5oops', '?page=-1', '?page=1.5',
        '?page=Infinity', '?page=NaN', `?page=${steps.length}`, '?page=9007199254740992',
    ]) {
        const scenario = scenarioAt(search);
        assert.equal(scenario.step, 0, search);
        assert.equal(scenario.stage, steps[0], search);
        scenario.next();
        assert.equal(scenario.step, 1, search);
        assert.equal(scenario.stage, steps[1], search);
    }
});
