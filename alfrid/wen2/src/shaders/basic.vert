// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

// instancing
attribute vec3 aPosOffset;
attribute vec3 aExtra;
attribute vec3 aScale;

uniform mat4 uModelMatrix;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

uniform float uTime;
uniform float uSeed;

varying vec2 vTextureCoord;
varying vec3 vNormal;

#pragma glslify: rotate    = require(./glsl-utils/rotate.glsl)
#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)
#define PI 3.141592653

void main(void) {

    // global scale 
    float noise = snoise(vec3(aPosOffset.xy, uSeed + uTime)) * 0.5 + 0.5;

    float scale = mix(0.1, 1.0, aExtra.x);
    vec3 pos = aVertexPosition * scale * noise * aScale;

    // vec2 dir = normalize(aPosOffset.xy);
    vec2 dir = aPosOffset.xy;
    float theta = atan(dir.y, dir.x);

    float time = uTime * mix(1.0, 2.0, aExtra.y);

    pos.xy = rotate(pos.xy, -theta + time);

    vec3 posOffset = aPosOffset;
    posOffset.xy = rotate(posOffset.xy, time);

    pos += posOffset;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
}