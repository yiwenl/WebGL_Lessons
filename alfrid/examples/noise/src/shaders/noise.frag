// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform float uTime;

#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)
#pragma glslify: fbm    = require(./glsl-utils/fbm/3d.glsl)

void main(void) {
    vec2 ns = vec2(2.0, 10.0);
    vec3 p0 = vec3(vTextureCoord * ns, uTime);
    float noise0 = fbm(p0);

    vec3 p1 = vec3(vTextureCoord * ns, uTime);
    float noise1 = snoise(p1);


    float noise = mix(noise0, noise1, step(vTextureCoord.x, .5));

    gl_FragColor = vec4(vec3(noise), 1.0);
}