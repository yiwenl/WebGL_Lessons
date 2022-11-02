// basic.vert

precision highp float;
attribute vec3 aPosition;
attribute vec3 aColor;

// uniforms
uniform vec3 uOffset;
uniform float uScale;

// passing to fragment shader
varying vec3 vColor;

void main(void) {
    gl_Position = vec4(aPosition * uScale + uOffset, 1.0);

    vColor = aColor;
}