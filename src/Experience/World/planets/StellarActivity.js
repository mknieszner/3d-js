import * as THREE from 'three';

const CORONA_LENGTH_SCALE = 0.5;
const CORONA_EXTENT = 1.0 + 0.8 * CORONA_LENGTH_SCALE;
const ACTIVITY_TIME_SCALE = 0.5;
const noise = `
    float stellarHash(vec3 p) {
        p = fract(p * 0.1031);
        p += dot(p, p.yzx + 33.33);
        return fract((p.x + p.y) * p.z);
    }

    float stellarNoise(vec3 p) {
        vec3 cell = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
            mix(mix(stellarHash(cell), stellarHash(cell + vec3(1, 0, 0)), f.x),
                mix(stellarHash(cell + vec3(0, 1, 0)), stellarHash(cell + vec3(1, 1, 0)), f.x), f.y),
            mix(mix(stellarHash(cell + vec3(0, 0, 1)), stellarHash(cell + vec3(1, 0, 1)), f.x),
                mix(stellarHash(cell + vec3(0, 1, 1)), stellarHash(cell + vec3(1, 1, 1)), f.x), f.y), f.z);
    }
`;

// The billboard faces the camera, but its plasma is anchored in the planet's local space.
export default class StellarActivity extends THREE.Mesh {
    constructor(radius, color, phase, surfaceMaterial, {plasma = false} = {}) {
        const uniforms = {
            uStellarTime: {value: 0},
            uStellarColor: {value: new THREE.Color(color)},
            uStellarPhase: {value: phase},
        };
        const material = new THREE.ShaderMaterial({
            uniforms,
            defines: plasma ? {STELLAR_PLASMA: 1} : {},
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            toneMapped: false,
            vertexShader: `
                varying vec2 vCoronaUv;
                varying vec3 vLocalRight;
                varying vec3 vLocalUp;

                void main() {
                    vCoronaUv = uv;
                    vec4 center = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
                    vec3 towardCamera = normalize(-center.xyz);
                    vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), towardCamera));
                    vec3 up = cross(towardCamera, right);
                    float worldScale = length(modelMatrix[0].xyz);
                    // Undo the planet's rotation for pattern sampling, not for the billboard.
                    vLocalRight = vec3(
                        dot(right, modelViewMatrix[0].xyz),
                        dot(right, modelViewMatrix[1].xyz),
                        dot(right, modelViewMatrix[2].xyz)
                    ) / max(worldScale, 0.0001);
                    vLocalUp = vec3(
                        dot(up, modelViewMatrix[0].xyz),
                        dot(up, modelViewMatrix[1].xyz),
                        dot(up, modelViewMatrix[2].xyz)
                    ) / max(worldScale, 0.0001);
                    center.xyz += (right * position.x + up * position.y) * worldScale;
                    gl_Position = projectionMatrix * center;
                }
            `,
            fragmentShader: `
                uniform float uStellarTime;
                uniform vec3 uStellarColor;
                uniform float uStellarPhase;
                varying vec2 vCoronaUv;
                varying vec3 vLocalRight;
                varying vec3 vLocalUp;
                ${noise}

                void main() {
                    vec2 point = (vCoronaUv * 2.0 - 1.0) * ${CORONA_EXTENT.toFixed(1)};
                    float radius = length(point);
                    float height = max(0.0, radius - 1.0) / ${CORONA_LENGTH_SCALE.toFixed(1)};
                    float innerFade = smoothstep(0.96, 1.025, radius);
                    float outerFade = 1.0 - smoothstep(0.38, 0.72, height);
                    if (innerFade * outerFade < 0.001) discard;

                    vec2 direction = point / max(radius, 0.001);
                    vec3 localDirection = normalize(vLocalRight * direction.x + vLocalUp * direction.y);
                    vec3 phaseOffset = vec3(uStellarPhase);
                    float cells = stellarNoise(localDirection * 4.0 + phaseOffset);
                    float glow = exp(-height * 9.0) * (0.18 + cells * 0.18);
                    float streamers = 0.0;
                    float arcs = 0.0;

                    #ifdef STELLAR_PLASMA
                    vec3 localTangent = -vLocalRight * direction.y + vLocalUp * direction.x;
                    // Signed local noise bends neighboring plumes in different directions.
                    float bendNoise = stellarNoise(localDirection * 5.0 + phaseOffset
                        + vec3(2.7, 9.1, 4.3)) * 2.0 - 1.0;
                    float flutter = stellarNoise(localDirection * 11.0 + phaseOffset
                        + vec3(height * 3.0, uStellarTime * 0.12, 0.0)) * 2.0 - 1.0;
                    float bend = height * (bendNoise + flutter * 0.25);
                    vec3 curved = localDirection * cos(bend) + localTangent * sin(bend);
                    // Fewer, separated peaks leave gaps of undisturbed glow between plumes.
                    float activePatch = smoothstep(0.42, 0.68, stellarNoise(localDirection * 5.0
                        + phaseOffset + vec3(17.1, 3.4, 8.2)));
                    float threads = smoothstep(0.66, 0.86, stellarNoise(curved * 14.0 + phaseOffset))
                        * activePatch * 0.55;
                    float reach = 0.14 + 0.34 * cells;
                    streamers = threads * (1.0 - smoothstep(0.01, reach, height));
                    streamers *= 0.85 + 0.15 * sin(uStellarTime * 1.3 + cells * 6.0 + uStellarPhase);

                    for (int i = 0; i < 3; i++) {
                        float index = float(i);
                        float life = fract(uStellarTime * 0.045 + uStellarPhase * 0.17 + index * 0.33);
                        float longitude = uStellarPhase + index * 2.094;
                        float latitude = (index - 1.0) * 0.45;
                        vec3 anchor = vec3(cos(latitude) * cos(longitude), sin(latitude),
                            cos(latitude) * sin(longitude));
                        vec2 projectedAnchor = vec2(dot(anchor, vLocalRight), dot(anchor, vLocalUp));
                        vec2 axis = projectedAnchor / max(length(projectedAnchor), 0.001);
                        vec2 tangent = vec2(-axis.y, axis.x);
                        vec2 offset = point - projectedAnchor * 0.99;
                        vec2 local = vec2(dot(offset, tangent), dot(offset, axis))
                            / ${CORONA_LENGTH_SCALE.toFixed(1)};
                        vec2 ellipse = local / vec2(0.13 + index * 0.025, 0.14 + life * 0.23);
                        float line = 1.0 - smoothstep(0.03, 0.13, abs(length(ellipse) - 1.0));
                        float pulse = pow(sin(life * 3.14159265), 2.0);
                        arcs += line * pulse * smoothstep(0.0, 0.045, local.y)
                            * exp(-max(local.y, 0.0) * 4.0);
                    }
                    #endif

                    float alpha = min(0.8, glow + streamers * 0.9 + arcs * 0.55)
                        * innerFade * outerFade;
                    vec3 plasmaColor = mix(uStellarColor, vec3(1.0), 0.04 + 0.14 * exp(-height * 14.0));
                    gl_FragColor = vec4(plasmaColor, alpha);
                    #include <colorspace_fragment>
                }
            `,
        });
        super(new THREE.PlaneGeometry(radius * CORONA_EXTENT * 2, radius * CORONA_EXTENT * 2), material);
        this.name = 'stellar-corona';
        this.corpo_bloomed = true;
        this.raycast = () => {};
        if (plasma) this.addSurfaceEmission(surfaceMaterial, uniforms);
    }

    addSurfaceEmission(material, uniforms) {
        material.onBeforeCompile = shader => {
            Object.assign(shader.uniforms, uniforms);
            shader.vertexShader = `varying vec3 vStellarPosition;\n${shader.vertexShader}`.replace(
                '#include <begin_vertex>',
                '#include <begin_vertex>\nvStellarPosition = position;'
            );
            shader.fragmentShader = `
                uniform float uStellarTime;
                uniform vec3 uStellarColor;
                uniform float uStellarPhase;
                varying vec3 vStellarPosition;
                ${noise}
                ${shader.fragmentShader}
            `.replace('#include <emissivemap_fragment>', `
                #include <emissivemap_fragment>
                vec3 stellarFlow = normalize(vStellarPosition) * 10.0 + vec3(uStellarPhase);
                float stellarCells = stellarNoise(stellarFlow);
                float stellarHeat = smoothstep(0.54, 0.82, stellarNoise(stellarFlow * 2.1));
                float stellarPulse = 0.65 + 0.35 * sin(uStellarTime * 0.8 + stellarCells * 6.0 + uStellarPhase);
                totalEmissiveRadiance += uStellarColor * stellarHeat * stellarPulse * 0.5;
            `);
        };
        material.customProgramCacheKey = () => 'stellar-surface-emission-v2';
    }

    update(elapsed) {
        // Slow growth, fading and flutter independently of the planet's rotation.
        this.material.uniforms.uStellarTime.value = elapsed * 0.001 * ACTIVITY_TIME_SCALE;
    }
}
