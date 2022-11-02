
#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;

// uniforms
uniform float uBrightness;

// passed from vertex shader
varying vec3 vColor;

void main(void) {
    gl_FragColor = vec4(vColor + vec3(uBrightness), 1.0);
}