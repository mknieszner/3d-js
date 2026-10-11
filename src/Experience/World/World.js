import Experience from "../Experiance.js";
import Environment from "./Environment.js";
import Resources from "../Utils/Resources.js";
import MainNucleus from "./nucleus/MainNucleus.js";
import RedNucleus from "./nucleus/RedNucleus.js";
import GreenNucleus from "./nucleus/GreenNucleus.js";
import YellowNucleus from "./nucleus/YellowNucleus.js";
import PurpleNucleus from "./nucleus/PurpleNucleus.js";
import OrangeNucleus from "./nucleus/OrangeNucleus.js";
import PinkNucleus from "./nucleus/PinkNucleus.js";
import Satellite from "./satellite/Satellite.js";
import CorpoText from "./texts/CorpoText.js";
import DracoText from "./texts/satelites/DracoText.js";
import TaurusText from "./texts/satelites/TaurusText.js";
import AquariusText from "./texts/satelites/AquariusText.js";
import GeminiText from "./texts/satelites/GeminiText.js";
import BgSphere from "./BgSphere.js";
import Stars from "./Stars.js";
import DefaultPlanet from "./planets/DefaultPlanet.js";
import DomainTeamText from "./texts/satelites/DomainTeamText.js";
import Astros from "./missels/Astros.js";
import PlanetProcessC from "./planets/Models/PlanetProcessC.js";
import PlanetProcessA from "./planets/Models/PlanetProcessA.js";
import PlanetDomain1 from "./planets/Models/PlanetDomain1.js";
import PlanetDomain2 from "./planets/Models/PlanetDomain2.js";
import PlanetDomain3 from "./planets/Models/PlanetDomain3.js";
import PlanetProcessB from "./planets/Models/PlanetProcessB.js";
import PlanetText from "./planets/text/PlanetText.js";
import Bridge from "./models/Bridge.js";
import VideoPlane from "./planes/VideoPlane.js";
import Scores from "./scores/Scores.js";
import ScoreModel from "./scores/ScoreModel.js";
import CongratulationsText from "./texts/CongratulationsText.js";
import Intro from "./intro/Intro.js";
import Debug from "../Utils/Debug.js";
import StagePreloader from '../Utils/StagePreloader.js';

export default class World {
    texts = [];
    constelations = [];
    missiles = [];
    planets = [];

    constructor() {
        this.experiance = Experience.INSTANCE;
        this.resources = this.experiance.resources;
        this.time = this.experiance.time;

        this.resources.on(Resources.READY_EVENT, () => {
            this.mainNucleus = new MainNucleus();
            this.redNucleus = new RedNucleus();
            this.greenNucleus = new GreenNucleus();
            this.yellowNucleus = new YellowNucleus();
            this.purpleNucleus = new PurpleNucleus();
            this.orangeNucleus = new OrangeNucleus();
            this.pinkNucleus = new PinkNucleus();
            this.sphere = new BgSphere();

            // Longer periods farther from the center (Kepler's third law).
            const orbitalSpeed = radius => 20 * Math.pow(18 / radius, 1.5);
            this.mars = new DefaultPlanet('textureMars', 1.9, 18, orbitalSpeed(18), new PlanetText('Sys. X', 0xD38F5C), {
                eccentricity: 0.08, inclination: 9, ascendingNode: 25, periapsis: 30, phase: 25,
            }, {plasma: true});
            this.jupiter = new DefaultPlanet('textureJupiter', 2.6, 21, orbitalSpeed(21), new PlanetText('Sys. Y', 0xCBCCCC), {
                eccentricity: 0.06, inclination: -13, ascendingNode: 105, periapsis: 110, phase: 155,
            });
            this.neptune = new DefaultPlanet('textureIce', 2, 25, orbitalSpeed(25), new PlanetText('Sys. Z', 0x6EADD2), {
                eccentricity: 0.10, inclination: 17, ascendingNode: 175, periapsis: 225, phase: 265,
            });
            this.moon = new DefaultPlanet('textureDeath', 3.1, 30, orbitalSpeed(30), new PlanetText('Sys. A', 0xE2300F), {
                eccentricity: 0.07, inclination: -8, ascendingNode: 250, periapsis: 60, phase: 80,
            }, {plasma: true});
            this.sun = new DefaultPlanet('textureSun', 2, 35, orbitalSpeed(35), new PlanetText('Sys. B', 0xE0CD2A), {
                eccentricity: 0.12, inclination: 12, ascendingNode: 320, periapsis: 160, phase: 210,
            }, {plasma: true});

            this.dracoTeam = new Satellite('draco', 'baseRocket3', new DracoText());
            this.taurusTeam = new Satellite('taurus', 'baseRocket2', new TaurusText())
            this.aquariusTeam = new Satellite('aquarius', 'baseRocket1', new AquariusText());
            this.geminiTeam = new Satellite('gemini', 'baseRocket4', new GeminiText());
            this.domainTeam = new Satellite('domain', 'baseRocket5', new DomainTeamText());

            this.planets = [
                new PlanetProcessB(),
                new PlanetProcessC(),
                new PlanetProcessA(),
                new PlanetDomain1(),
                new PlanetDomain2(),
                new PlanetDomain3(),
            ]

            this.constelations = [
                new Stars('textureStar', 10, 0.5),
                new Stars('textureStar2', 50, 0.5, true),
                new Stars('textureStar2', 10, 0.5),
                new Stars('textureStar3', 10, 0.5)
            ];

            this.missiles = [
                new Astros('textureAstroRed', 1, this.dracoTeam, 'white', 3),
                new Astros('textureAstroGreen', 1, this.taurusTeam, 'white', 3),
                new Astros('textureAstroBlue', 1, this.geminiTeam, 'white', 3),
                new Astros('textureAstroGold', 1, this.aquariusTeam, 'white', 3),
                new Astros('textureStar1', 1, this.domainTeam, 'white', 3)
            ];
            this.bridge = new Bridge();

            this.video = new VideoPlane({borderMaterial: this.bridge.sprecialMaterial.clone()});

            this.texts = [
                new CorpoText(0.05)
            ];

            this.scores = new Scores(this.bridge.sprecialMaterial.clone())
            this.scoreModel = new ScoreModel()

            this.intro = new Intro()

            this.environment = new Environment();
            this.preloader = new StagePreloader(this.experiance, this.bridge.screenMessage);
            this.ready = this.prepare();
        })
    }

    async prepare() {
        await this.preloader.prepare();
        await this.experiance.renderer.prepare([this.bridge.group, this.scoreModel.group]);
        this.isReady = true;
    }

    update() {
        if (!this.isReady) return;
        this.mainNucleus?.update();
        this.redNucleus?.update();
        this.greenNucleus?.update();
        this.yellowNucleus?.update();
        this.purpleNucleus?.update();
        this.orangeNucleus?.update();
        this.pinkNucleus?.update();
        this.sphere?.update();
        this.mars?.update();
        this.jupiter?.update();
        this.neptune?.update();
        this.moon?.update();
        this.sun?.update();

        this.dracoTeam?.update(0);
        this.taurusTeam?.update(1.5);
        this.aquariusTeam?.update(3);
        this.geminiTeam?.update(4.5);
        this.domainTeam?.update(0);

        this.constelations.forEach(el => el?.update());

        this.missiles.forEach((el) => el?.update());
        this.planets.forEach((el) => el?.update());
        this.bridge?.update();
        this.texts?.forEach((el) => el?.update());

        this.scores?.update();
        this.scoreModel?.update();

        this.intro?.update();

        this.resources.mixers.forEach(el => el.update(this.time.delta / Debug.getModelVelocity()));
    }
}
