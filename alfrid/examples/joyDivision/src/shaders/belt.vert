// basic.vert


precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aNormal;
attribute vec2 aTextureCoord;
attribute vec3 aPosOffset;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform float uSeedShift;
uniform float uTime;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPos;

#define PI 3.141592653
#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)
#pragma glslify: fbm    = require(./glsl-utils/fbm/3d.glsl)

void main(void) {
    float time = uTime * 0.1;
    float noiseShift = snoise(vec3(uSeedShift, 0.0, aPosOffset.z + time * 3.0) * 0.4);

    float theta = (aTextureCoord.x + noiseShift * 0.2) * PI;
    float h = sin(theta);
    h = clamp(h, 0.0, 1.0);
    h = pow(h, 3.0);

    vec3 p = vec3(aTextureCoord.x, 10.0 + time, aPosOffset.z);
    float noise = fbm(p * 5.0);
    h += noise * 0.5 * mix(0.1, 1.0, h);

    vec3 pos = aVertexPosition;
    pos.y += h * 1.5;

    pos += aPosOffset;


    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;

    vec4 viewPos = uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vPos = viewPos.xyz;

    vNormal = aNormal;
}