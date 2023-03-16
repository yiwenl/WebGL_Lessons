precision highp float;
varying vec2 vTextureCoord;
uniform vec3 uColor;
uniform float uOpacity;

void main(void) {
    gl_FragColor = vec4(uColor, uOpacity);
}