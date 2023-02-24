// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vPosition;
uniform float uSeed;
uniform float uTotal;
uniform vec3 uPointA;
uniform vec3 uPointB;

#pragma glslify: fbm    = require(./glsl-utils/fbm/3d.glsl)


void main(void) {
    float n = fbm(vPosition * 0.5 + uSeed);
    n = smoothstep(0.3, .7, n);

    // distance to line
    vec3 pos = vPosition;

    vec3 dirToPos = normalize(pos - uPointA);
    vec3 dirLine = normalize(uPointB - uPointA);
    float angleBetween = acos(dot(dirToPos, dirLine));
    float distToPointA = distance(pos, uPointA);
    float distToLine = sin(angleBetween) * distToPointA;
    float r = distToPointA * 0.5;
    distToLine = 1.0 - smoothstep(0.0, r, distToLine);

    float g = mix(0.6, 1.0, n);

    // gl_FragColor = vec4(vPosition, 1.0);
    gl_FragColor = vec4(vec3(1.0), n/uTotal);
    // gl_FragColor = vec4(vec3(g), distToLine/uTotal);
}