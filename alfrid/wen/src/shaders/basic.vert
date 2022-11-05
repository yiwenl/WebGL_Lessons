// basic.vert

precision highp float;
attribute vec3 aPosition;
attribute vec3 aColor;
attribute vec3 aOffset;

varying vec3 vColor;

void main(void) {
    vec3 finalPosition = aPosition + aOffset;
    gl_Position = vec4(finalPosition, 1.0);

    vColor = aColor;
}