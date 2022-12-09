// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D uHeightMap;
uniform float uSize;

varying vec2 vTextureCoord;
varying vec3 vNormal;

void main(void) {
    vec2 posTemp = vec2(aVertexPosition.x, 0.0);
    vec2 uv = (posTemp + aPosOffset.xz) / uSize * .5 + 0.5;
    float height = texture2D(uHeightMap, uv).r;
    vec3 pos = aVertexPosition;
    pos.y = height;
    pos.z += aPosOffset.z;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
    vTextureCoord = uv;
}