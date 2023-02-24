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

#define PI 3.141592653

void main(void) {

    float hx = sin(aTextureCoord.x * PI);
    float hy = sin(aTextureCoord.y * PI);
    float p = mix(1.5, 4.0, aPosOffset.y);
    float h = pow(hx * hy, p);

    vec3 pos = aVertexPosition;
    pos.y = h;
    pos.y *= mix(1.0, 0.5, aExtra.x);
    pos *= mix(1.0, 2.0, aExtra.y);
    // pos.y -= 1.0;

    pos.xz += aPosOffset.xz;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
}