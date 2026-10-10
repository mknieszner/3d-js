import ScoreTitle from "./ScoreTitle.js";
import ScoreDescription from "./ScoreDescription.js";
import Experience from "../../Experiance.js";
import Scenario from "../../Scenario/Scenario.js";
import ScoresPlane from "./ScoresPlane.js";
import ScoreGraph from "./ScoreGraph.js";

export default class Scores {
    items = []

    constructor(material) {
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.material = material
        this.watchConfig();
    }

    watchConfig() {
        this.setConfig()
        this.experiance.config.on(Scenario.CHAPTER_CHANGE, () => this.setConfig())
    }

    setConfig() {
        this.config = this.experiance.config.stage.texts?.scores;
        this.setMeshes(this.config);
    }

    setMeshes(config) {
        this.items.forEach(item => item.dispose?.());

        const planePositions = [
            {
                position: {x: 0, y: 0, z: 19},
                lookAt: {x: 0, z: 21},
                graph1Position: {x: -9, y: 0, z: 19},
                graph1lookAtPosition: {x: -9, y: 0, z: 21},
                graph2Position: {x: 9, y: 0, z: 19},
                graph2lookAtPosition: {x: 9, y: 0, z: 21},
            },
            {
                position: {x: 20.78, y: 0, z: -10.39},
                lookAt: {x: 41.56, z: -20.78},
                graph1Position: {x: 25, y: 0, z: -2.4},
                graph1lookAtPosition: {x: 46.4, y: 0, z: -13},
                graph2Position: {x: 16.5, y: 0, z: -18.9},
                graph2lookAtPosition: {x: 45.1, y: 0, z: -33.4},
            },
            {
                position: {x: -20.78, y: 0, z: -10.39},
                lookAt: {x: -41.56, z: -20.78},
                graph1Position: {x: -15.6, y: 0, z: -20.8},
                graph1lookAtPosition: {x: -94.9, y: 0, z: -58.8},
                graph2Position: {x: -25.5, y: 0, z: -1.3},
                graph2lookAtPosition: {x: -44.5, y: 0, z: -10.2},
            }
        ];
        const scorePlane1 = new ScoresPlane(planePositions[0].position, planePositions[0].lookAt);
        const scoreTitle1 = new ScoreTitle(this.material.clone(), {x: 0, y: 11, z: 20}, {x: 0, z: 21});
        const scoreDescription1 = new ScoreDescription(this.material.clone(), {x: 0, z: 20}, {x: 0, z: 21});

        const scorePlane2 = new ScoresPlane(planePositions[1].position, planePositions[1].lookAt);
        const scoreTitle2 = new ScoreTitle(this.material.clone(), {x: 20.78, y: 11, z: -10.39}, {x: 41.56, z: -20.78});
        const scoreDescription2 = new ScoreDescription(this.material.clone(), {x: 20.78, z: -10.39}, {
            x: 41.56,
            z: -20.78
        });

        const scorePlane3 = new ScoresPlane(planePositions[2].position, planePositions[2].lookAt);
        const scoreTitle3 = new ScoreTitle(this.material.clone(), {x: -20.78, y: 11, z: -10.39}, {
            x: -41.56,
            z: -20.78
        });
        const scoreDescription3 = new ScoreDescription(this.material.clone(), {x: -20.78, z: -10.39}, {
            x: -41.56,
            z: -20.78
        });

        const ringGraph1Before = new ScoreGraph(planePositions[0].graph1Position, planePositions[0].graph1lookAtPosition, 'graph ONE-L');
        const ringGraph1After = new ScoreGraph(planePositions[0].graph2Position, planePositions[0].graph2lookAtPosition, 'graph ONE-R');

        const ringGraph2Before = new ScoreGraph(planePositions[1].graph1Position, planePositions[1].graph1lookAtPosition, 'graph TWO-L');
        const ringGraph2After = new ScoreGraph(planePositions[1].graph2Position, planePositions[1].graph2lookAtPosition, 'graph TWO-R');

        const ringGraph3Before = new ScoreGraph(planePositions[2].graph1Position, planePositions[2].graph1lookAtPosition, 'graph THREE-L');
        const ringGraph3After = new ScoreGraph(planePositions[2].graph2Position, planePositions[2].graph2lookAtPosition, 'graph THREE-R');

        this.items = [
            scorePlane1,
            scorePlane2,
            scorePlane3,
            scoreTitle1,
            scoreTitle2,
            scoreTitle3,
            scoreDescription1,
            scoreDescription2,
            scoreDescription3,
            ringGraph1Before,
            ringGraph1After,
            ringGraph2Before,
            ringGraph2After,
            ringGraph3Before,
            ringGraph3After,
        ]

        scorePlane1.resetMesh(config);
        scorePlane2.resetMesh(config);
        scorePlane3.resetMesh(config);

        scoreTitle1.resetMesh(config?.data1);
        scoreTitle2.resetMesh(config?.data2);
        scoreTitle3.resetMesh(config?.data3);

        scoreDescription1.resetMesh(config?.data1, true);
        scoreDescription2.resetMesh(config?.data2, false);
        scoreDescription3.resetMesh(config?.data3, false);

        ringGraph1Before.resetMesh(config?.graph?.left1, 'BEFORE', config?.graph?.on === 0);
        ringGraph1After.resetMesh(config?.graph?.right1, 'AFTER', config?.graph?.on === 0);
        ringGraph2Before.resetMesh(config?.graph?.left2, 'BEFORE', config?.graph?.on === 1);
        ringGraph2After.resetMesh(config?.graph?.right2, 'AFTER', config?.graph?.on === 1);
        ringGraph3Before.resetMesh(config?.graph?.left3, 'BEFORE', config?.graph?.on === 2);
        ringGraph3After.resetMesh(config?.graph?.right3, 'AFTER', config?.graph?.on === 2);
    }

    update() {

    }
}