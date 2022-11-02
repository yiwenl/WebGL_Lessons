// basic.vert

precision highp float;
attribute vec3 aPosition;
attribute vec3 aColor;

// passing to fragment shader
varying vec3 vColor;

void main(void) {
    gl_Position = vec4(aPosition, 1.0);

    vColor = aColor;
}