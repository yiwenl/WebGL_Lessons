#version 300 es

precision highp float;
in vec3 aVertexPosition;
in vec3 aExtra;
in vec2 aTextureCoord;

out vec3 vPosition;
out vec3 vExtra;

void main(void) {
    gl_Position = vec4(aTextureCoord, 0.0, 1.0);
    vPosition = aVertexPosition;
    vExtra = aExtra;

    gl_PointSize = 1.0;
}