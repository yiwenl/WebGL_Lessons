// basic.vert

precision highp float;
attribute vec3 aPosition;
attribute vec3 aColor;

// uniforms
uniform mat4 uProjMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModMatrix;

// passing to fragment shader
varying vec3 vColor;

void main(void) {
    gl_Position = uProjMatrix * uViewMatrix * uModMatrix * vec4(aPosition, 1.0);

    vColor = aColor;
}