// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vPosition;
uniform float uTotal;
uniform float uSeed;
uniform float uTime;

uniform vec3 uPointA;
uniform vec3 uPointB;

uniform sampler2D uDepthMap;

varying vec4 vShadowCoord;

#pragma glslify: fbm    = require(./glsl-utils/fbm/3d.glsl)

void main(void) {
    float a = 1.0 / uTotal;

    vec4 shadowCoord = vShadowCoord / vShadowCoord.w;
    vec2 uv = shadowCoord.xy * 0.5 + 0.5;

    float bias = 0.01;
    float depth = texture2D(uDepthMap, uv).r - bias;
    float g = depth > shadowCoord.z ? 1.0 : 0.0;

    // vec3 pos = vPosition;

    // vec3 dirToPoint = normalize(pos - uPointA);
    // vec3 dirLine = normalize(uPointB - uPointA);
    // float angleBetween = acos(dot(dirToPoint, dirLine));
    // float distToPoint = distance(pos, uPointA);
    // float r = sin(angleBetween) * distToPoint;

    // r = 1.0 - smoothstep(0.0, distToPoint * 0.5, r);

    // float fallOff = smoothstep(4.0, 3.0, distToPoint);


    // float n = fbm(vPosition * 0.5 + uSeed + vec3(0.0, 0.0, uTime * 0.1));
    // n = smoothstep(0.3, 0.7, n);

    gl_FragColor = vec4(vec3(1.0), a * g);
    // gl_FragColor = vec4(vec3(n), 1.0);
    // gl_FragColor = vec4(vec3(0.8 + n), a * r * fallOff);
    // gl_FragColor = vec4(vPosition, 1.0);
}
