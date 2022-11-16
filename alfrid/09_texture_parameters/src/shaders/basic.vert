// basic.vert

precision highp float;
attribute vec3 aPosition;
attribute vec2 aUV;

// uniforms
uniform mat4 uProjMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModMatrix;

// passing to fragment shader
varying vec2 vUV;

void main(void) {
    gl_Position = uProjMatrix * uViewMatrix * uModMatrix * vec4(aPosition, 1.0);

    vUV = aUV;
}