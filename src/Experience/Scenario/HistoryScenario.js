import {INITIAL_CAMERA} from "./ScoresScenario.js";
import Debug from "../Utils/Debug.js";

const BRIDGE_CAMERA_SETTINGS = {
    locked: true,
    velocity: Debug.getCameraVelocity(),
    position: {
        x: -0,
        y: 5,
        z: 125
    }
}

const MOVIE_CAMERA_POSITION = {
    x: -0,
    y: 5,
    z: 64
}


const CONGRATS_CAMERA_POSITION = {
    x: -0,
    y: 2,
    z: 64
}

const DEFAULT_SATELLITE_SCALES = {
    draco: 0.3,
    gemini: 6,
    aquarius: 0.002,
    taurus: 0.5,
    domain: 0.15,
}


export const HISTORY_STEPS = [
    {
        camera: {
            locked: false,
            position: {
                x: -30,
                y: 20,
                z: 55
            }
        },
        menuContent: 'PROLOG',
        lights: {
            ambient: {
                intensity: 5
            },
            sun: {
                color: 0xffffff
            }
        },
        texts: {
            corpo: {
                scale: 1.2,
            },
            processA: {
                scale: 0,
            },
            processB: {
                scale: 0,
            },
            processC: {
                scale: 0,
            },
            domain: {
                scale: 0,
            },
        },
        nucleus: {
            main: {
                scale: 1.5,
                insideTexture: 'mainNucleus',
            },
            red: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'redInsideNucleus'
            },
            orange: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'orangeNucleusInside'
            },
            green: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'greenNucleusInside'
            },
            purple: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'purpleNucleusInside'
            },
            pink: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'pinkNucleusInside'
            },
            yellow: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'yellowNucleusInside'
            }
        },
        shield: {
            white: {
                scale: 0,
                color: 'silver'
            },
            red: {
                scale: 0,
                color: 'darkred'
            },
            green: {
                scale: 0,
                color: 'darkgreen'
            },
            orange: {
                scale: 0,
                color: '#6B6E77'
            }
        },
        guard: {
            scale: 0
        },
        satellite: {
            update: true,
            selfRotationVelocity: 1,
            draco: {
                scale: DEFAULT_SATELLITE_SCALES.draco,
                radius: 6,
                position: {x: 0, y: 0, z: 0}
            },
            gemini: {
                scale: DEFAULT_SATELLITE_SCALES.gemini,
                radius: 6,
                position: {x: 0, y: 0, z: 0}
            },
            aquarius: {
                scale: DEFAULT_SATELLITE_SCALES.aquarius,
                radius: 6,
                position: {x: 0, y: 0, z: 0}
            },
            taurus: {
                scale: DEFAULT_SATELLITE_SCALES.taurus,
                radius: 6,
                position: {x: 0, y: 0, z: 0}
            },
            domain: {
                scale: 0,
                radius: 0,
                position: {x: 0, y: 0, z: 0}
            }
        },
        defaultPlanet: {
            scale: 1,
        },
        planets: {
            planet0: {
                scale: 0
            },
            planet1: {
                scale: 0
            },
            planet2: {
                scale: 0
            },
            planet3: {
                scale: 0
            },
            planet4: {
                scale: 0
            },
            planet5: {
                scale: 0
            },
            planet6: {
                scale: 0
            }
        },
        missiles: {
            scale: 1,
            minTarget: 0.5,
        },
        description: {
            scale: 0,
            color: 'red',
            targetOpacity: 0,
            content: [],
            activeActor: null,
            video: {
                on: false
            }
        },
        cockpit: {
            scale: 0,
        },
        processB: {
            content: []
        }
    },
    {
        camera: {
            locked: false,
            position: {
                x: -15,
                y: -10,
                z: 10
            }
        },
        menuContent: 'PROLOG',
        lights: {
            ambient: {
                intensity: 5
            },
            sun: {
                color: 0xffffff
            }
        },
        texts: {
            corpo: {
                scale: 1,
            },
            processA: {
                scale: 0,
            },
            processB: {
                scale: 0,
            },
            processC: {
                scale: 0,
            },
            domain: {
                scale: 0,
            },
        },
        nucleus: {
            main: {
                scale: 1.5,
                insideTexture: 'mainNucleus',
            },
            red: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'redInsideNucleus'
            },
            orange: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'orangeNucleusInside'
            },
            green: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'greenNucleusInside'
            },
            purple: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'purpleNucleusInside'
            },
            pink: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'pinkNucleusInside'
            },
            yellow: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'yellowNucleusInside'
            }
        },
        shield: {
            white: {
                scale: 0,
                color: 'silver'
            },
            red: {
                scale: 0,
                color: 'darkred'
            },
            green: {
                scale: 0,
                color: 'darkgreen'
            },
            orange: {
                scale: 0,
                color: '#6B6E77'
            }
        },
        guard: {
            scale: 0
        },
        satellite: {
            update: true,
            selfRotationVelocity: 1,
            draco: {
                scale: DEFAULT_SATELLITE_SCALES.draco,
                radius: 5,
                position: {x: 0, y: 0, z: 0}
            },
            gemini: {
                scale: DEFAULT_SATELLITE_SCALES.gemini,
                radius: 5,
                position: {x: 0, y: 0, z: 0}
            },
            aquarius: {
                scale: DEFAULT_SATELLITE_SCALES.aquarius,
                radius: 5,
                position: {x: 0, y: 0, z: 0}
            },
            taurus: {
                scale: DEFAULT_SATELLITE_SCALES.taurus,
                radius: 5,
                position: {x: 0, y: 0, z: 0}
            },
            domain: {
                scale: 0,
                radius: 0,
                position: {x: 0, y: 0, z: 0}
            }
        },
        defaultPlanet: {
            scale: 0,
        },
        planets: {
            planet0: {
                scale: 0
            },
            planet1: {
                scale: 0
            },
            planet2: {
                scale: 0
            },
            planet3: {
                scale: 0
            },
            planet4: {
                scale: 0
            },
            planet5: {
                scale: 0
            },
            planet6: {
                scale: 0
            }
        },
        missiles: {
            scale: 1,
            minTarget: 0.5,
        },
        description: {
            scale: 0,
            color: 'red',
            targetOpacity: 0,
            content: [],
            activeActor: null,
            video: {
                on: false
            }
        },
        cockpit: {
            scale: 0,
        },
        processB: {
            content: []
        }
    },
    {
        camera: {
            locked: true,
            position: MOVIE_CAMERA_POSITION,
        },
        menuContent: 'PROLOG',
        lights: {
            ambient: {
                intensity: 0.1
            },
            sun: {
                color: 0x000000
            }
        },
        texts: {
            corpo: {
                scale: 0,
            },
            processA: {
                scale: 0,
            },
            processB: {
                scale: 0,
            },
            processC: {
                scale: 0,
            },
            domain: {
                scale: 0,
            },
        },
        nucleus: {
            main: {
                scale: 0,
                insideTexture: 'mainNucleus',
            },
            red: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'redInsideNucleus'
            },
            orange: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'orangeNucleusInside'
            },
            green: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'greenNucleusInside'
            },
            purple: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'purpleNucleusInside'
            },
            pink: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'pinkNucleusInside'
            },
            yellow: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'yellowNucleusInside'
            }
        },
        shield: {
            white: {
                scale: 0,
                color: 'silver'
            },
            red: {
                scale: 0,
                color: 'darkred'
            },
            green: {
                scale: 0,
                color: 'darkgreen'
            },
            orange: {
                scale: 0,
                color: '#6B6E77'
            }
        },
        guard: {
            scale: 0
        },
        satellite: {
            update: true,
            selfRotationVelocity: 1,
            draco: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            gemini: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            aquarius: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            taurus: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            domain: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            }
        },
        defaultPlanet: {
            scale: 0,
        },
        planets: {
            planet0: {
                scale: 0
            },
            planet1: {
                scale: 0
            },
            planet2: {
                scale: 0
            },
            planet3: {
                scale: 0
            },
            planet4: {
                scale: 0
            },
            planet5: {
                scale: 0
            },
            planet6: {
                scale: 0
            }
        },
        missiles: {
            scale: 0,
            minTarget: 1.8,
        },
        description: {
            scale: 1,
            color: 'red',
            targetOpacity: 0.9,
            content: [
                'P R O L O G'
            ],
            activeActor: null,
            video: {
                name: 'zombie-video',
                on: true
            },
        },
        cockpit: {
            scale: 0,
        },
        processB: {
            scale: 0,
            content: []
        }
    },
    {
        camera: BRIDGE_CAMERA_SETTINGS,
        menuContent: 'PROLOG',
        lights: {
            ambient: {
                intensity: 0.1
            },
            sun: {
                color: 0x000000
            }
        },
        texts: {
            corpo: {
                scale: 0,
            },
            processA: {
                scale: 0,
            },
            processB: {
                scale: 0,
            },
            processC: {
                scale: 0,
            },
            domain: {
                scale: 0,
            },
        },
        nucleus: {
            main: {
                scale: 0,
                insideTexture: 'mainNucleus',
            },
            red: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'redInsideNucleus'
            },
            orange: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'orangeNucleusInside'
            },
            green: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'greenNucleusInside'
            },
            purple: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'purpleNucleusInside'
            },
            pink: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'pinkNucleusInside'
            },
            yellow: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'yellowNucleusInside'
            }
        },
        shield: {
            white: {
                scale: 0,
                color: 'silver'
            },
            red: {
                scale: 0,
                color: 'darkred'
            },
            green: {
                scale: 0,
                color: 'darkgreen'
            },
            orange: {
                scale: 0,
                color: '#6B6E77'
            }
        },
        guard: {
            scale: 0
        },
        satellite: {
            update: true,
            selfRotationVelocity: 1,
            draco: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            gemini: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            aquarius: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            taurus: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            domain: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            }
        },
        defaultPlanet: {
            scale: 0,
        },
        planets: {
            planet0: {
                scale: 0
            },
            planet1: {
                scale: 0
            },
            planet2: {
                scale: 0
            },
            planet3: {
                scale: 0
            },
            planet4: {
                scale: 0
            },
            planet5: {
                scale: 0
            },
            planet6: {
                scale: 0
            }
        },
        missiles: {
            scale: 0,
            minTarget: 1.8,
        },
        description: {
            scale: 1,
            color: 'red',
            targetOpacity: 0.9,
            content: [
                'P R O L O G',

                'W I E L O M I E S I E C Z N E   O P O Z N I E N I A   W   D O W O Z E N I U',
                '',
                'N I E A K C E P T O W A L N A   W Y D A J N O S C   A P L I K A C J I',
                '',
                'D U Z A   L I C Z B A   B L E D O W   R E G R E S Y J N Y C H',
                '',
                '',
                '',
                'N I E E F E K T Y W N Y   M O D E L   W S P O L P R A C Y   W   S Q U A D A C H',
                '',
                'N I E E F E K T Y W N Y   M O D E L   W S P O L P R A C Y   P O M I E D Z Y   S Q U A D A M I',
                '',
                'B R A K   S P O J N E J   W I Z J I   N A   A R C H I T E K T U R E',
                '',
                'S E T K I   T Y I S I E C Y   L I N I I   N I E U P O R Z A D K O W N A E G O   K O D U',
            ],
            activeActor: 'zombieAgony',
            video: {
                on: false
            },
        },
        cockpit: {
            scale: 1,
        },
        processB: {
            scale: 0,
            content: []
        }
    },
    {
        camera: {
            locked: false,
            position: {
                x: -15,
                y: -10,
                z: 25
            }
        },
        menuContent: 'ROZDZIAL I',
        lights: {
            ambient: {
                intensity: 10
            },
            sun: {
                color: 0xffffff
            }
        },
        texts: {
            corpo: {
                scale: 1,
            },
            processA: {
                scale: 1,
            },
            processB: {
                scale: 1,
            },
            processC: {
                scale: 1,
            },
            domain: {
                scale: 1,
            },
        },
        nucleus: {
            main: {
                scale: 0,
                insideTexture: 'mainNucleus',
            },
            red: {
                scale: 1,
                position: {x: -5, y: 0, z: 0},
                insideTexture: 'redInsideNucleus'
            },
            orange: {
                scale: 3,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'orangeNucleusInside'
            },
            green: {
                scale: 1,
                position: {x: 5, y: 0, z: 0},
                insideTexture: 'greenNucleusInside'
            },
            purple: {
                scale: 1,
                position: {x: -3.5, y: -6, z: 0},
                insideTexture: 'purpleNucleusInside'
            },
            pink: {
                scale: 1,
                position: {x: 0, y: -6, z: 0},
                insideTexture: 'pinkNucleusInside'
            },
            yellow: {
                scale: 1,
                position: {x: 3.5, y: -6, z: 0},
                insideTexture: 'yellowNucleusInside'
            }
        },
        shield: {
            white: {
                scale: 0,
                color: 'silver'
            },
            red: {
                scale: 0,
                color: 'darkred'
            },
            green: {
                scale: 0,
                color: 'darkgreen'
            },
            orange: {
                scale: 0,
                color: '#6B6E77'
            }
        },
        guard: {
            scale: 0
        },
        satellite: {
            update: true,
            selfRotationVelocity: 1,
            draco: {
                scale: DEFAULT_SATELLITE_SCALES.draco,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            gemini: {
                scale: DEFAULT_SATELLITE_SCALES.gemini,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            aquarius: {
                scale: DEFAULT_SATELLITE_SCALES.aquarius,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            taurus: {
                scale: DEFAULT_SATELLITE_SCALES.taurus,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            domain: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            }
        },
        defaultPlanet: {
            scale: 0,
        },
        planets: {
            planet0: {
                scale: 0
            },
            planet1: {
                scale: 0
            },
            planet2: {
                scale: 0
            },
            planet3: {
                scale: 0
            },
            planet4: {
                scale: 0
            },
            planet5: {
                scale: 0
            },
            planet6: {
                scale: 0
            }
        },
        missiles: {
            scale: 1,
            minTarget: 1.8,
        },
        description: {
            scale: 0,
            color: 'orange',
            targetOpacity: 0,
            content: [],
            activeActor: null,
            video: {
                on: false
            },
        },
        cockpit: {
            scale: 0,
        },
        processB: {
            content: ['DOMAIN 1', 'DOMAIN 2', 'DOMAIN 3']
        }
    },
    {
        camera: {
            locked: true,
            position: MOVIE_CAMERA_POSITION,
        },
        menuContent: 'ROZDZIAL I',
        lights: {
            ambient: {
                intensity: 0.1
            },
            sun: {
                color: 0xffffff
            }
        },
        texts: {
            corpo: {
                scale: 0,
            },
            processA: {
                scale: 0,
            },
            processB: {
                scale: 0,
            },
            processC: {
                scale: 0,
            },
            domain: {
                scale: 0,
            },
        },
        nucleus: {
            main: {
                scale: 0,
                insideTexture: 'mainNucleus',
            },
            red: {
                scale: 0,
                position: {x: -5, y: 0, z: 0},
                insideTexture: 'redInsideNucleus'
            },
            orange: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'orangeNucleusInside'
            },
            green: {
                scale: 0,
                position: {x: 5, y: 0, z: 0},
                insideTexture: 'greenNucleusInside'
            },
            purple: {
                scale: 0,
                position: {x: -3.5, y: -6, z: 0},
                insideTexture: 'purpleNucleusInside'
            },
            pink: {
                scale: 0,
                position: {x: 0, y: -6, z: 0},
                insideTexture: 'pinkNucleusInside'
            },
            yellow: {
                scale: 0,
                position: {x: 3.5, y: -6, z: 0},
                insideTexture: 'yellowNucleusInside'
            }
        },
        shield: {
            white: {
                scale: 0,
                color: 'silver'
            },
            red: {
                scale: 0,
                color: 'darkred'
            },
            green: {
                scale: 0,
                color: 'darkgreen'
            },
            orange: {
                scale: 0,
                color: '#6B6E77'
            }
        },
        guard: {
            scale: 0
        },
        satellite: {
            update: true,
            selfRotationVelocity: 1,
            draco: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            gemini: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            aquarius: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            taurus: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            domain: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            }
        },
        defaultPlanet: {
            scale: 0,
        },
        planets: {
            planet0: {
                scale: 0
            },
            planet1: {
                scale: 0
            },
            planet2: {
                scale: 0
            },
            planet3: {
                scale: 0
            },
            planet4: {
                scale: 0
            },
            planet5: {
                scale: 0
            },
            planet6: {
                scale: 0
            }
        },
        missiles: {
            scale: 1,
            minTarget: 1.8,
        },
        description: {
            scale: 0,
            color: 'orange',
            targetOpacity: 0,
            content: [],
            activeActor: null,
            video: {
                name: 'conflict-video',
                on: true
            },
        },
        cockpit: {
            scale: 0,
        },
        processB: {
            content: ['DOMAIN 1', 'DOMAIN 2', 'DOMAIN 3']
        }
    },
    {
        camera: BRIDGE_CAMERA_SETTINGS,
        menuContent: 'ROZDZIAL I',
        lights: {
            ambient: {
                intensity: 0.1
            },
            sun: {
                color: 0x000000
            }
        },
        texts: {
            corpo: {
                scale: 0,
            },
            processA: {
                scale: 0,
            },
            processB: {
                scale: 0,
            },
            processC: {
                scale: 0,
            },
            domain: {
                scale: 0,
            },
        },
        nucleus: {
            main: {
                scale: 0,
                insideTexture: 'mainNucleus',
            },
            red: {
                scale: 1,
                position: {x: -5, y: 0, z: 0},
                insideTexture: 'redInsideNucleus'
            },
            orange: {
                scale: 3,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'orangeNucleusInside'
            },
            green: {
                scale: 1,
                position: {x: 5, y: 0, z: 0},
                insideTexture: 'greenNucleusInside'
            },
            purple: {
                scale: 1,
                position: {x: -3.5, y: -6, z: 0},
                insideTexture: 'purpleNucleusInside'
            },
            pink: {
                scale: 1,
                position: {x: 0, y: -6, z: 0},
                insideTexture: 'pinkNucleusInside'
            },
            yellow: {
                scale: 1,
                position: {x: 3.5, y: -6, z: 0},
                insideTexture: 'yellowNucleusInside'
            }
        },
        shield: {
            white: {
                scale: 0,
                color: 'silver'
            },
            red: {
                scale: 0,
                color: 'darkred'
            },
            green: {
                scale: 0,
                color: 'darkgreen'
            },
            orange: {
                scale: 0,
                color: '#6B6E77'
            }
        },
        guard: {
            scale: 0
        },
        satellite: {
            update: true,
            selfRotationVelocity: 1,
            draco: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            gemini: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            aquarius: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            taurus: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            domain: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            }
        },
        defaultPlanet: {
            scale: 0,
        },
        planets: {
            planet0: {
                scale: 0
            },
            planet1: {
                scale: 0
            },
            planet2: {
                scale: 0
            },
            planet3: {
                scale: 0
            },
            planet4: {
                scale: 0
            },
            planet5: {
                scale: 0
            },
            planet6: {
                scale: 0
            }
        },
        missiles: {
            scale: 1,
            minTarget: 1.8,
        },
        description: {
            scale: 1,
            color: 'orange',
            targetOpacity: 0.9,
            content: [
                'R O Z D Z I A L   I',
                'B R A K   O P O Z N I E N   W   D O S T A R C Z A N I U   F U N K C J O N A L N O S C I',
                '',
                'A K C E P T O W A L N A   W Y D A J N O S C   A P L I K A C J I',
                '',
                'D U Z A   L I C Z B A   B L E D O W   R E G R E S Y J N Y C H',
                '',
                '',
                '',
                'U D O S K O N A L O N Y   M O D E L   W S P O L P R A C Y   W   S Q U A D A C H',
                '',
                'N I E E F E K T Y W N Y   M O D E L   W S P O L P R A C Y   P O M I E D Z Y   S Q U A D A M I',
                '',
                'R E F I N E M E N T,   W A R S Z T A T Y,   G I L D I A  -  S P O J N A   W I Z J A   A R C H I T E K T U R Y',
                '',
                'S E T K I   T Y I S I E C Y   L I N I I   N I E U P O R Z A D K O W N A E G O   K O D U',
            ],
            activeActor: 'zombieYelling',
            video: {
                on: false
            },
        },
        cockpit: {
            scale: 1,
        },
        processB: {
            content: []
        }
    },
    {
        camera: {
            locked: false,
            position: {
                x: -15,
                y: -10,
                z: 25
            }
        },
        menuContent: 'ROZDZIAL II',
        lights: {
            ambient: {
                intensity: 10
            },
            sun: {
                color: 0xffffff
            }
        },
        texts: {
            corpo: {
                scale: 1,
            },
            processA: {
                scale: 1,
            },
            processB: {
                scale: 1,
            },
            processC: {
                scale: 1,
            },
            domain: {
                scale: 1,
            },
        },
        nucleus: {
            main: {
                scale: 0,
                insideTexture: 'mainNucleus',
            },
            red: {
                scale: 1,
                position: {x: -5, y: 0, z: 0},
                insideTexture: 'redInsideNucleus'
            },
            orange: {
                scale: 3,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'orangeNucleusInside'
            },
            green: {
                scale: 1,
                position: {x: 5, y: 0, z: 0},
                insideTexture: 'greenNucleusInside'
            },
            purple: {
                scale: 1,
                position: {x: -3.5, y: -6, z: 0},
                insideTexture: 'purpleNucleusInside'
            },
            pink: {
                scale: 1,
                position: {x: 0, y: -6, z: 0},
                insideTexture: 'pinkNucleusInside'
            },
            yellow: {
                scale: 1,
                position: {x: 3.5, y: -6, z: 0},
                insideTexture: 'yellowNucleusInside'
            }
        },
        shield: {
            white: {
                scale: 1,
                color: 'silver'
            },
            red: {
                scale: 0,
                color: 'darkred'
            },
            green: {
                scale: 0,
                color: 'darkgreen'
            },
            orange: {
                scale: 0,
                color: '#6B6E77'
            }
        },
        guard: {
            scale: 1
        },
        satellite: {
            update: true,
            selfRotationVelocity: 1,
            draco: {
                scale: DEFAULT_SATELLITE_SCALES.draco,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            gemini: {
                scale: DEFAULT_SATELLITE_SCALES.gemini,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            aquarius: {
                scale: DEFAULT_SATELLITE_SCALES.aquarius,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            taurus: {
                scale: DEFAULT_SATELLITE_SCALES.taurus,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            domain: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            }
        },
        defaultPlanet: {
            scale: 0,
        },
        planets: {
            planet0: {
                scale: 0
            },
            planet1: {
                scale: 0
            },
            planet2: {
                scale: 0
            },
            planet3: {
                scale: 0
            },
            planet4: {
                scale: 0
            },
            planet5: {
                scale: 0
            },
            planet6: {
                scale: 0
            }
        },
        missiles: {
            scale: 1,
            minTarget: 1.8,
        },
        description: {
            scale: 0,
            color: 'blue',
            targetOpacity: 0,
            content: [],
            activeActor: null,
            video: {
                on: false
            },
        },
        cockpit: {
            scale: 0,
        },
        processB: {
            content: ['DOMAIN 1', 'DOMAIN 2', 'DOMAIN 3']
        }
    },
    {
        camera: BRIDGE_CAMERA_SETTINGS,
        menuContent: 'ROZDZIAL  II',
        lights: {
            ambient: {
                intensity: 0.1
            },
            sun: {
                color: 0x000000
            }
        },
        texts: {
            corpo: {
                scale: 1,
            },
            processA: {
                scale: 1,
            },
            processB: {
                scale: 1,
            },
            processC: {
                scale: 1,
            },
            domain: {
                scale: 1,
            },
        },
        nucleus: {
            main: {
                scale: 0,
                insideTexture: 'mainNucleus',
            },
            red: {
                scale: 1,
                position: {x: -5, y: 0, z: 0},
                insideTexture: 'redInsideNucleus'
            },
            orange: {
                scale: 3,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'orangeNucleusInside'
            },
            green: {
                scale: 1,
                position: {x: 5, y: 0, z: 0},
                insideTexture: 'greenNucleusInside'
            },
            purple: {
                scale: 1,
                position: {x: -3.5, y: -6, z: 0},
                insideTexture: 'purpleNucleusInside'
            },
            pink: {
                scale: 1,
                position: {x: 0, y: -6, z: 0},
                insideTexture: 'pinkNucleusInside'
            },
            yellow: {
                scale: 1,
                position: {x: 3.5, y: -6, z: 0},
                insideTexture: 'yellowNucleusInside'
            }
        },
        shield: {
            white: {
                scale: 1,
                color: 'silver'
            },
            red: {
                scale: 0,
                color: 'darkred'
            },
            green: {
                scale: 0,
                color: 'darkgreen'
            },
            orange: {
                scale: 0,
                color: '#6B6E77'
            }
        },
        guard: {
            scale: 1
        },
        satellite: {
            update: true,
            selfRotationVelocity: 1,
            draco: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            gemini: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            aquarius: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            taurus: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            domain: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            }
        },
        defaultPlanet: {
            scale: 0,
        },
        planets: {
            planet0: {
                scale: 0
            },
            planet1: {
                scale: 0
            },
            planet2: {
                scale: 0
            },
            planet3: {
                scale: 0
            },
            planet4: {
                scale: 0
            },
            planet5: {
                scale: 0
            },
            planet6: {
                scale: 0
            }
        },
        missiles: {
            scale: 1,
            minTarget: 1.8,
        },
        description: {
            scale: 1,
            color: 'blue',
            targetOpacity: 0.9,
            content: [
                'R O Z D Z I A L   I I',
                'B R A K   O P O Z N I E N   W   D O S T A R C Z A N I U   F U N K C J O N A L N O S C I',
                '',
                'A K C E P T O W A L N A   W Y D A J N O S C   A P L I K A C J I',
                '',
                'D U Z A   L I C Z B A   B L E D O W   R E G R E S Y J N Y C H',
                '',
                '',
                '',
                'U D O S K O N A L O N Y   M O D E L   W S P O L P R A C Y   W   S Q U A D A C H',
                '',
                'U S P R A W N I O N Y   M O D E L   W S P O L P R A C Y   P O M I E D Z Y   S Q U A D A M I',
                '',
                'R E F I N E M E N T,   W A R S Z T A T Y,   G I L D I A  -  S P O J N A   W I Z J A   A R C H I T E K T U R Y',
                '',
                'S E T K I   T Y I S I E C Y   L I N I I   N I E U P O R Z A D K O W N A E G O   K O D U',
            ],
            activeActor: 'zombieVictory',
            video: {
                on: false
            },
        },
        cockpit: {
            scale: 1,
        },
        processB: {
            content: []
        }
    },
    {
        camera: {
            locked: false,
            position: {
                x: 0,
                y: 0,
                z: 40
            }
        },
        menuContent: 'ROZDZIAL  III',
        lights: {
            ambient: {
                intensity: 10
            },
            sun: {
                color: 0xffffff
            }
        },
        texts: {
            corpo: {
                scale: 1,
            },
            processA: {
                scale: 1,
            },
            processB: {
                scale: 1,
            },
            processC: {
                scale: 1,
            },
            domain: {
                scale: 1,
            },
        },
        nucleus: {
            main: {
                scale: 0,
                insideTexture: 'mainNucleus',
            },
            red: {
                scale: 1.5,
                position: {x: -6, y: 0, z: 0},
                insideTexture: 'redInsideNucleusPositive'
            },
            orange: {
                scale: 3.5,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'orangeNucleusInsidePositive'
            },
            green: {
                scale: 1.5,
                position: {x: 6, y: 0, z: 0},
                insideTexture: 'greenNucleusInsidePositive'
            },
            purple: {
                scale: 1.5,
                position: {x: -4.5, y: -7, z: 0},
                insideTexture: 'purpleNucleusInsidePositive'
            },
            pink: {
                scale: 1.5,
                position: {x: 0, y: -7, z: 0},
                insideTexture: 'pinkNucleusInsidePositive'
            },
            yellow: {
                scale: 1.5,
                position: {x: 4.5, y: -7, z: 0},
                insideTexture: 'yellowNucleusInsidePositive'
            }
        },
        shield: {
            white: {
                scale: 0,
                color: 'silver'
            },
            red: {
                scale: 0,
                color: 'darkred'
            },
            green: {
                scale: 0,
                color: 'darkgreen'
            },
            orange: {
                scale: 0,
                color: '#6B6E77'
            }
        },
        guard: {
            scale: 0
        },
        satellite: {
            update: false,
            selfRotationVelocity: 3,
            draco: {
                overX: 0,
                overY: 1.5,
                scale: DEFAULT_SATELLITE_SCALES.draco,
                radius: 1.2,
                position: {x: -6, y: 0.5, z: 0}
            },
            gemini: {
                overX: -1,
                overY: 4,
                scale: DEFAULT_SATELLITE_SCALES.gemini,
                radius: 3.5,
                position: {x: 0, y: 0, z: 0}
            },
            aquarius: {
                overX: 1,
                overY: 4,
                scale: DEFAULT_SATELLITE_SCALES.aquarius,
                radius: 3.5,
                position: {x: 0, y: 0, z: 0}
            },
            taurus: {
                overX: 0,
                overY: 1.5,
                scale: DEFAULT_SATELLITE_SCALES.taurus,
                radius: 1.2,
                position: {x: 6, y: 0.5, z: 0}
            },
            domain: {
                overX: 0,
                overY: 1.5,
                scale: DEFAULT_SATELLITE_SCALES.domain,
                radius: 1.5,
                position: {x: 0, y: -6, z: 0}
            }
        },
        defaultPlanet: {
            scale: 0,
        },
        planets: {
            planet0: {
                position: {x: 0},
                scale: 2
            },
            planet1: {
                position: {x: 6},
                scale: 0.5
            },
            planet2: {
                position: {x: -6},
                scale: 0.5
            },
            planet3: {
                scale: 0.5
            },
            planet4: {
                scale: 0.003
            },
            planet5: {
                scale: 60
            },
            planet6: {
                scale: 0.5
            }
        },
        missiles: {
            scale: 1,
            minTarget: 1.8,
        },
        description: {
            scale: 0,
            color: 'green',
            targetOpacity: 0,
            content: [],
            activeActor: null,
            video: {
                on: false
            },
        },
        cockpit: {
            scale: 0,
        },
        processB: {
            content: []
        }
    },
    {
        camera: {
            locked: false,
            rotateRadius: 40,
            position: {
                x: -15,
                y: -10,
                z: 25
            }
        },
        menuContent: 'ROZDZIAL  III',
        lights: {
            ambient: {
                intensity: 2
            },
            sun: {
                color: 0x000000
            }
        },
        texts: {
            corpo: {
                scale: 1,
            },
            processA: {
                scale: 0,
            },
            processB: {
                scale: 0,
            },
            processC: {
                scale: 0,
            },
            domain: {
                scale: 0,
            },
        },
        nucleus: {
            thetaLength: 0,
            main: {
                scale: 0,
                insideTexture: 'mainNucleus',
            },
            red: {
                scale: 1.5,
                position: {x: -6, y: 0, z: 0},
                insideTexture: 'redInsideNucleusPositive'
            },
            orange: {
                scale: 3.5,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'orangeNucleusInsidePositive'
            },
            green: {
                scale: 1.5,
                position: {x: 6, y: 0, z: 0},
                insideTexture: 'greenNucleusInsidePositive'
            },
            purple: {
                scale: 1.5,
                position: {x: -4.5, y: -7, z: 0},
                insideTexture: 'purpleNucleusInsidePositive'
            },
            pink: {
                scale: 1.5,
                position: {x: 0, y: -7, z: 0},
                insideTexture: 'pinkNucleusInsidePositive'
            },
            yellow: {
                scale: 1.5,
                position: {x: 4.5, y: -7, z: 0},
                insideTexture: 'yellowNucleusInsidePositive'
            }
        },
        shield: {
            white: {
                scale: 0,
                color: 'silver'
            },
            red: {
                scale: 0,
                color: 'darkred'
            },
            green: {
                scale: 0,
                color: 'darkgreen'
            },
            orange: {
                scale: 0,
                color: '#6B6E77'
            }
        },
        guard: {
            scale: 0
        },
        satellite: {
            update: false,
            selfRotationVelocity: 3,
            draco: {
                overX: 0,
                overY: 1.5,
                scale: DEFAULT_SATELLITE_SCALES.draco,
                radius: 1.2,
                position: {x: -6, y: 0.5, z: 0}
            },
            gemini: {
                overX: -1,
                overY: 4,
                scale: DEFAULT_SATELLITE_SCALES.gemini,
                radius: 3.5,
                position: {x: 0, y: 0, z: 0}
            },
            aquarius: {
                overX: 1,
                overY: 4,
                scale: DEFAULT_SATELLITE_SCALES.aquarius,
                radius: 3.5,
                position: {x: 0, y: 0, z: 0}
            },
            taurus: {
                overX: 0,
                overY: 1.5,
                scale: DEFAULT_SATELLITE_SCALES.taurus,
                radius: 1.2,
                position: {x: 6, y: 0.5, z: 0}
            },
            domain: {
                overX: 0,
                overY: 1.5,
                scale: DEFAULT_SATELLITE_SCALES.domain,
                radius: 1.5,
                position: {x: 0, y: -6, z: 0}
            }
        },
        defaultPlanet: {
            scale: 0,
        },
        planets: {
            targetThetaLength: Math.PI * 2,
            planet0: {
                position: {x: 0},
                scale: 2.5
            },
            planet1: {
                position: {x: 6},
                scale: 0.9
            },
            planet2: {
                position: {x: -6},
                scale: 0.9
            },
            planet3: {
                scale: 0.9
            },
            planet4: {
                scale: 0.004
            },
            planet5: {
                scale: 95
            },
            planet6: {
                scale: 0.9
            }
        },
        missiles: {
            scale: 1,
            minTarget: 1.8,
        },
        description: {
            scale: 0,
            color: 'green',
            targetOpacity: 0,
            content: [],
            activeActor: null,
            video: {
                on: false
            },
        },
        cockpit: {
            scale: 0,
        },
        processB: {
            content: []
        }
    },
    {
        camera: BRIDGE_CAMERA_SETTINGS,
        menuContent: 'THANK YOU',
        lights: {
            ambient: {
                intensity: 0.1
            },
            sun: {
                color: 0x000000
            }
        },
        texts: {
            corpo: {
                scale: 0,
            },
            processA: {
                scale: 0,
            },
            processB: {
                scale: 0,
            },
            processC: {
                scale: 0,
            },
            domain: {
                scale: 0,
            },
        },
        nucleus: {
            main: {
                scale: 0,
                insideTexture: 'mainNucleus',
            },
            red: {
                scale: 0,
                position: {x: -5, y: 0, z: 0},
                insideTexture: 'redInsideNucleusPositive'
            },
            orange: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'orangeNucleusInsidePositive'
            },
            green: {
                scale: 0,
                position: {x: 5, y: 0, z: 0},
                insideTexture: 'greenNucleusInsidePositive'
            },
            purple: {
                scale: 0,
                position: {x: -3.5, y: -6, z: 0},
                insideTexture: 'purpleNucleusInsidePositive'
            },
            pink: {
                scale: 0,
                position: {x: 0, y: -6, z: 0},
                insideTexture: 'pinkNucleusInsidePositive'
            },
            yellow: {
                scale: 0,
                position: {x: 3.5, y: -6, z: 0},
                insideTexture: 'yellowNucleusInsidePositive'
            }
        },
        shield: {
            white: {
                scale: 0,
                color: 'silver'
            },
            red: {
                scale: 0,
                color: 'darkred'
            },
            green: {
                scale: 0,
                color: 'darkgreen'
            },
            orange: {
                scale: 0,
                color: '#6B6E77'
            }
        },
        guard: {
            scale: 0
        },
        satellite: {
            update: false,
            selfRotationVelocity: 1,
            draco: {
                overY: 2,
                scale: 0,
                radius: 1.2,
                position: {x: 0, y: 0, z: 0}
            },
            gemini: {
                overY: 4,
                scale: 0,
                radius: 3.5,
                position: {x: 0, y: 0, z: 0}
            },
            aquarius: {
                overY: 4,
                scale: 0,
                radius: 3.5,
                position: {x: 0, y: 0, z: 0}
            },
            taurus: {
                overY: 2,
                scale: 0,
                radius: 1.2,
                position: {x: 0, y: 0, z: 0}
            },
            domain: {
                overY: 2,
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: -6, z: 0}
            }
        },
        defaultPlanet: {
            scale: 0,
        },
        planets: {
            planet0: {
                scale: 0
            },
            planet1: {
                scale: 0
            },
            planet2: {
                scale: 0
            },
            planet3: {
                scale: 0
            },
            planet4: {
                scale: 0
            },
            planet5: {
                scale: 0
            },
            planet6: {
                scale: 0
            }
        },
        missiles: {
            scale: 1,
            minTarget: 1.8,
        },
        description: {
            scale: 1,
            color: 'green',
            targetOpacity: 0.9,
            content: [
                'E P I L O G',
                'O P T Y M A L N E   T E M P O   D O S T A R C Z A N I A   F U N K C J O N A L N O S C I',
                '',
                'O P T Y M A L N A   W Y D A J N O S C   A P L I K A C J I',
                '',
                'O P T Y M A L N A    L I C Z B A   B L E D O W   R E G R E S Y J N Y C H',
                '',
                '',
                '',
                '',
                '',
                'D E V   W   S Q U A D A C H   S A    W Y S P E C J A L I Z O W A N I   I   E F E K T Y W N I',
                '',
                'R E F I N E M E N T,   W A R S Z T A T Y,   G I L D I A  -  S P O J N A   A R C H I T E K T U R A',
                '',
                'D L U G    T E C H N I C Z N Y   K O D U   P O D    K O N T R O L A',
            ],
            activeActor: 'zombieSalute',
            video: {
                on: false
            },
        },
        cockpit: {
            scale: 1,
        },
        processB: {
            content: []
        }
    },
    {
        camera: {
            locked: true,
            position: CONGRATS_CAMERA_POSITION,
        },
        menuContent: 'THANK YOU',
        lights: {
            ambient: {
                intensity: 0.1
            },
            sun: {
                color: 0xffffff
            }
        },
        texts: {
            corpo: {
                scale: 0,
            },
            processA: {
                scale: 0,
            },
            processB: {
                scale: 0,
            },
            processC: {
                scale: 0,
            },
            domain: {
                scale: 0,
            },
        },
        nucleus: {
            main: {
                scale: 0,
                insideTexture: 'mainNucleus',
            },
            red: {
                scale: 0,
                position: {x: -5, y: 0, z: 0},
                insideTexture: 'redInsideNucleus'
            },
            orange: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'orangeNucleusInside'
            },
            green: {
                scale: 0,
                position: {x: 5, y: 0, z: 0},
                insideTexture: 'greenNucleusInside'
            },
            purple: {
                scale: 0,
                position: {x: -3.5, y: -6, z: 0},
                insideTexture: 'purpleNucleusInside'
            },
            pink: {
                scale: 0,
                position: {x: 0, y: -6, z: 0},
                insideTexture: 'pinkNucleusInside'
            },
            yellow: {
                scale: 0,
                position: {x: 3.5, y: -6, z: 0},
                insideTexture: 'yellowNucleusInside'
            }
        },
        shield: {
            white: {
                scale: 0,
                color: 'silver'
            },
            red: {
                scale: 0,
                color: 'darkred'
            },
            green: {
                scale: 0,
                color: 'darkgreen'
            },
            orange: {
                scale: 0,
                color: '#6B6E77'
            }
        },
        guard: {
            scale: 0
        },
        satellite: {
            update: true,
            selfRotationVelocity: 1,
            draco: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            gemini: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            aquarius: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            taurus: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            domain: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            }
        },
        defaultPlanet: {
            scale: 0,
        },
        planets: {
            planet0: {
                scale: 0
            },
            planet1: {
                scale: 0
            },
            planet2: {
                scale: 0
            },
            planet3: {
                scale: 0
            },
            planet4: {
                scale: 0
            },
            planet5: {
                scale: 0
            },
            planet6: {
                scale: 0
            }
        },
        missiles: {
            scale: 0,
            minTarget: 1.8,
        },
        description: {
            scale: 0,
            color: 'orange',
            targetOpacity: 0,
            content: [],
            activeActor: null,
            video: {
                name: 'congrats-video',
                on: true,
                width: 25,
                height: 25
            },
        },
        cockpit: {
            scale: 0,
        },
        processB: {
            content: []
        }
    },
    {
        camera: {
            locked: true,
            position: INITIAL_CAMERA,
        },
        menuContent: 'THANK YOU',
        lights: {
            ambient: {
                intensity: 0.1
            },
            sun: {
                color: 0xffffff
            }
        },
        intro: {
          scale: 1
        },
        texts: {
            scores: {
                scale: 1,
            },
            corpo: {
                scale: 0,
            },
            processA: {
                scale: 0,
            },
            processB: {
                scale: 0,
            },
            processC: {
                scale: 0,
            },
            domain: {
                scale: 0,
            },
            congrats: {
                scale: 1
            }
        },
        nucleus: {
            main: {
                scale: 0,
                insideTexture: 'mainNucleus',
            },
            red: {
                scale: 0,
                position: {x: -5, y: 0, z: 0},
                insideTexture: 'redInsideNucleus'
            },
            orange: {
                scale: 0,
                position: {x: 0, y: 0, z: 0},
                insideTexture: 'orangeNucleusInside'
            },
            green: {
                scale: 0,
                position: {x: 5, y: 0, z: 0},
                insideTexture: 'greenNucleusInside'
            },
            purple: {
                scale: 0,
                position: {x: -3.5, y: -6, z: 0},
                insideTexture: 'purpleNucleusInside'
            },
            pink: {
                scale: 0,
                position: {x: 0, y: -6, z: 0},
                insideTexture: 'pinkNucleusInside'
            },
            yellow: {
                scale: 0,
                position: {x: 3.5, y: -6, z: 0},
                insideTexture: 'yellowNucleusInside'
            }
        },
        shield: {
            white: {
                scale: 0,
                color: 'silver'
            },
            red: {
                scale: 0,
                color: 'darkred'
            },
            green: {
                scale: 0,
                color: 'darkgreen'
            },
            orange: {
                scale: 0,
                color: '#6B6E77'
            }
        },
        guard: {
            scale: 0
        },
        satellite: {
            update: true,
            selfRotationVelocity: 1,
            draco: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            gemini: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            aquarius: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            taurus: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            },
            domain: {
                scale: 0,
                radius: 4.5,
                position: {x: 0, y: 0, z: 0}
            }
        },
        defaultPlanet: {
            scale: 0,
        },
        planets: {
            planet0: {
                scale: 0
            },
            planet1: {
                scale: 0
            },
            planet2: {
                scale: 0
            },
            planet3: {
                scale: 0
            },
            planet4: {
                scale: 0
            },
            planet5: {
                scale: 0
            },
            planet6: {
                scale: 0
            }
        },
        missiles: {
            scale: 0,
            minTarget: 1.8,
        },
        description: {
            scale: 0,
            color: 'orange',
            targetOpacity: 0,
            content: [],
            activeActor: null,
            video: {
                on: false
            },
        },
        cockpit: {
            scale: 0,
        },
        processB: {
            content: []
        }
    },
];
