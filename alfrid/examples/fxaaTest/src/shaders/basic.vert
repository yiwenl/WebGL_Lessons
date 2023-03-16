// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;

#pragma glslify: rotate    = require(./glsl-utils/rotate.glsl)
#define PI 3.141592653

void main(void) {
    vec3 pos = aVertexPosition * mix(0.1, 0.5, aExtra.x);

    pos.xz = rotate(pos.xz, aExtra.y * PI * 2.0);
    pos.yz = rotate(pos.yz, aExtra.x * PI * 2.0);

    pos += aPosOffset;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;

    vec3 N = aNormal;
    N.xz = rotate(N.xz, aExtra.y * PI * 2.0);
    N.yz = rotate(N.yz, aExtra.x * PI * 2.0);
    vNormal = N;
}