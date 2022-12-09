// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform float uSeed;
uniform float uTime;

#pragma glslify: fbm    = require(./glsl-utils/fbm/3d.glsl)
#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)

void main(void) {
    float h = fbm(vec3(vTextureCoord.x, vTextureCoord.y + uTime * 0.2, uSeed) * 0.5);
    h = smoothstep(0.2, 0.6, h);

    gl_FragColor = vec4(vec3(h), 1.0);
}