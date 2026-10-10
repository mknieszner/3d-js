export const INITIAL_CAMERA = {
    x: -10, y: 16.2, z: -50
};

const SCORES_CAMERA = [
    {
        x: 0, y: 0, z: 80
    }, {
        x: 76, y: 0, z: -39
    }, {
        x: -76, y: 0, z: -39
    }
];

const SCORES_STEP = {
    camera: {
        locked: false,
        position: SCORES_CAMERA[0]
    },
    menuContent: 'SCORES',
    lights: {
        ambient: {
            intensity: 0.2
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
        update: false,
        selfRotationVelocity: 1,
        draco: {
            scale: 0,
            radius: 6,
            position: {x: 0, y: 0, z: 0}
        },
        gemini: {
            scale: 0,
            radius: 6,
            position: {x: 0, y: 0, z: 0}
        },
        aquarius: {
            scale: 0,
            radius: 6,
            position: {x: 0, y: 0, z: 0}
        },
        taurus: {
            scale: 0,
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
}

const SCORES = [
    {
        y: 7,
        title: '',
        descriptionSize: 1.2,
        description: '            C O R P O   P L A T F O R M\n\n'
            + '\n\n'
            + '       -  POSUMOWOWANIE   2023\n'
            + '           -  HISTORIA   CHAPTERU\n'
    },
    {
        y: 5,
        title: 'PRZEWIDYWALNOSC WYCEN - 91.40 %',
        description: 'EPIC 1..............................93.35 %\n' +
            'EPIC 2..............................80.35 %\n' +
            'EPIC 3..............................80.31 %\n\n' +
            'EPIC 4..............................91.09 %\n' +
            'EPIC 5............................102.84 %\n' +
            'EPIC 6..............................92.79 %\n\n' +
            'EPIC 7..............................88.54 %\n' +
            'EPIC 8............................102.71 %\n' +
            'EPIC 9..............................90.49 %'
    },
    {
        y: 0,
        title: 'REFINEMENT',
        description: '2022 - TOTAL: 336 MD, PER DEV: 16.80 MD\n\n'
            + '2023 - TOTAL: 371 MD, PER DEV: 14.84 MD\n\n'
            + '                     ZMIANA r/r       - 12 %'
    },
    {
        y: 0,
        title: 'BUG + BUGFIX',
        description: '2022 - TOTAL: 458 MD, PER DEV: 22.90 MD\n\n'
            + '2023 - TOTAL: 446 MD, PER DEV: 17,84 MD\n\n'
            + '                 ZMIANA r/r       - 22,10 %'
    },
    {
        y: 3,
        title: 'CZAS PRACY NAD BUGAMI',
        description: '      2022:\n\n'
            + '< 8h :    87 %\n'
            + '< 4h :    76 %\n\n'
            + '      2023:\n\n'
            + '< 8h :    91 %\n'
            + '< 4h :    76 %\n\n'
    },
    {
        y: 5,
        title: 'WYDAJNOSC APLIKACJI',
        description: 'EKRAN 1 - MAKSYMALNY CZAS WEJSCIA:\n\n'
            + '                                2022     -     120 s\n'
            + '                                2024     -     15 s\n\n'
            + 'MAKSYMALNY CZAS KALKULACJI:\n\n'
            + '                                2022     -     60 s\n'
            + '                                2024     -     10 s\n\n'
            + 'MAKSYMALNY CZAS WYSZUKIWANIA:\n\n'
            + '                                2022     -     30 s\n'
            + '                                2024     -     2 s\n\n'
    },
    {
        y: 8,
        title: 'COHESION',
        description: 'M i a r a   r e u z y w a l n o s c i   k o d u'
    },
    {
        y: 8,
        title: 'COUPLING',
        description: 'M i ar a   r e g r e s y j n o s c i   s y s t e m u'
    },
    {
        y: 8,
        title: 'COMPLEXITY',
        description: 'M i a r a   c z y t e l o s c i   r o z w i a z a n i a'
    }
]


const BEFORE_TECH_SCORES = [
    { dg: 5.9, g: 37.2, y: 9.2, o: 10.5, r: 37.2 },
    { dg: 45.8, g: 4.4, y: 21.5, o: 12.3, r: 15.9 },
    { dg: 15.9, g: 12.3, y: 21.5, o: 4.4, r: 45.8 },
]

const AFTER_TECH_SCORES = [
    { dg: 90.7, g: 7.3, y: 2, o: 0, r: 0 },
    { dg: 84.3, g: 10.8, y: 4.4, o: 0.5, r: 0 },
    { dg: 84.7, g: 11.6, y: 3, o: 0.7, r: 0 },
]


export const SCORES_STEPS = [
    {
        ...SCORES_STEP,
        camera: {
            ...SCORES_STEP.camera,
            position: INITIAL_CAMERA
        },
        intro: {
            scale: 1,
        },
        texts: {
            ...SCORES_STEP.texts,
            scores: {
                scale: 1,
            }
        }
    },
    {
        ...SCORES_STEP,
        texts: {
            ...SCORES_STEP.texts,
            scores: {
                scale: 1,
                data1: {
                    ...SCORES[0],
                    opacity: 1
                },
                data2: {
                    ...SCORES[1],
                    opacity: 0.1
                },
                data3: {
                    ...SCORES[2],
                    opacity: 0.1
                }
            }
        }
    },
    {
        ...SCORES_STEP,
        camera: {
            ...SCORES_STEP.camera,
            position: SCORES_CAMERA[1]
        },
        texts: {
            ...SCORES_STEP.texts,
            scores: {
                scale: 1,
                data1: {
                    ...SCORES[0],
                    opacity: 0.1
                },
                data2: {
                    ...SCORES[1],
                    opacity: 1
                },
                data3: {
                    ...SCORES[2],
                    opacity: 0.1
                }
            }
        }
    },
    {
        ...SCORES_STEP,
        camera: {
            ...SCORES_STEP.camera,
            position: SCORES_CAMERA[2]
        },
        texts: {
            ...SCORES_STEP.texts,
            scores: {
                scale: 1,
                data1: {
                    ...SCORES[0],
                    opacity: 0.1
                },
                data2: {
                    ...SCORES[1],
                    opacity: 0.1
                },
                data3: {
                    ...SCORES[2],
                    opacity: 1
                }
            }
        }
    },
    {
        ...SCORES_STEP,
        camera: {
            ...SCORES_STEP.camera,
            position: SCORES_CAMERA[0]
        },
        texts: {
            ...SCORES_STEP.texts,
            scores: {
                scale: 1,
                data1: {
                    ...SCORES[3],
                    opacity: 1
                },
                data2: {
                    ...SCORES[4],
                    opacity: 0.1
                },
                data3: {
                    ...SCORES[2],
                    opacity: 0.1
                }
            }
        }
    },
    {
        ...SCORES_STEP,
        camera: {
            ...SCORES_STEP.camera,
            position: SCORES_CAMERA[1]
        },
        texts: {
            ...SCORES_STEP.texts,
            scores: {
                scale: 1,
                data1: {
                    ...SCORES[3],
                    opacity: 0.1
                },
                data2: {
                    ...SCORES[4],
                    opacity: 1
                },
                data3: {
                    ...SCORES[5],
                    opacity: 0.1
                }
            }
        }
    },
    {
        ...SCORES_STEP,
        camera: {
            ...SCORES_STEP.camera,
            position: SCORES_CAMERA[2]
        },
        texts: {
            ...SCORES_STEP.texts,
            scores: {
                scale: 1,
                data1: {
                    ...SCORES[6],
                    opacity: 0.1
                },
                data2: {
                    ...SCORES[4],
                    opacity: 0.1
                },
                data3: {
                    ...SCORES[5],
                    opacity: 1
                },
                graph: {
                    on: 0,
                    left1: BEFORE_TECH_SCORES[0],
                    right1: AFTER_TECH_SCORES[0],
                }
            }
        }
    },
    {
        ...SCORES_STEP,
        camera: {
            ...SCORES_STEP.camera,
            position: SCORES_CAMERA[0]
        },
        texts: {
            ...SCORES_STEP.texts,
            scores: {
                scale: 1,
                data1: {
                    ...SCORES[6],
                    opacity: 1
                },
                data2: {
                    ...SCORES[7],
                    opacity: 0.1
                },
                data3: {
                    ...SCORES[5],
                    opacity: 0.1
                },
                graph: {
                    on: 0,
                    left1: BEFORE_TECH_SCORES[0],
                    right1: AFTER_TECH_SCORES[0],
                    left2: BEFORE_TECH_SCORES[1],
                    right2: AFTER_TECH_SCORES[1],
                }
            }
        }
    },
    {
        ...SCORES_STEP,
        camera: {
            ...SCORES_STEP.camera,
            position: SCORES_CAMERA[1]
        },
        texts: {
            ...SCORES_STEP.texts,
            scores: {
                scale: 1,
                data1: {
                    ...SCORES[6],
                    opacity: 0.1
                },
                data2: {
                    ...SCORES[7],
                    opacity: 1
                },
                data3: {
                    ...SCORES[8],
                    opacity: 0.1
                },
                graph: {
                    on: 1,
                    left1: BEFORE_TECH_SCORES[0],
                    right1: AFTER_TECH_SCORES[0],
                    left2: BEFORE_TECH_SCORES[1],
                    right2: AFTER_TECH_SCORES[1],
                    left3: BEFORE_TECH_SCORES[2],
                    right3: AFTER_TECH_SCORES[2],
                }
            }
        }
    },
    {
        ...SCORES_STEP,
        camera: {
            ...SCORES_STEP.camera,
            position: SCORES_CAMERA[2]
        },
        texts: {
            ...SCORES_STEP.texts,
            scores: {
                scale: 1,
                data1: {
                    ...SCORES[5],
                    opacity: 0.1
                },
                data2: {
                    ...SCORES[6],
                    opacity: 0.1
                },
                data3: {
                    ...SCORES[8],
                    opacity: 1
                },
                graph: {
                    on: 2,
                    left2: BEFORE_TECH_SCORES[1],
                    right2: AFTER_TECH_SCORES[1],
                    left3: BEFORE_TECH_SCORES[2],
                    right3: AFTER_TECH_SCORES[2],
                }
            }
        }
    }
];
