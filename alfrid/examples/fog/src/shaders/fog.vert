// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aPosOffset;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uShadowMatrix;
uniform mat3 uModelViewMatrixInverse;

varying vec3 vPosition;
varying vec4 vShadowCoord;

void main(void) {
    vec3 pos = uModelViewMatrixInverse * (aVertexPosition + aPosOffset + vec3(0.0, 1.5, 0.0));
    // vec3 pos = (aVertexPosition + aPosOffset);
    vec4 wsPos = uModelMatrix * vec4(pos, 1.0);
    gl_Position = uProjectionMatrix * uViewMatrix * wsPos;
    vPosition = wsPos.xyz;

    vShadowCoord = uShadowMatrix * wsPos;
}