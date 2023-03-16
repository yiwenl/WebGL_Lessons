#version 300 es

precision highp float;
in vec2 vTextureCoord;

uniform sampler2D uPosMap;
uniform sampler2D uVelMap;
uniform sampler2D uExtraMap;

uniform float uTime;

layout (location = 0) out vec4 oFragColor0;
layout (location = 1) out vec4 oFragColor1;
layout (location = 2) out vec4 oFragColor2;

#pragma glslify: curlNoise    = require(./glsl-utils/curlNoise.glsl)

void main(void) {
    vec3 pos = texture(uPosMap, vTextureCoord).xyz;
    vec3 vel = texture(uVelMap, vTextureCoord).xyz;
    vec3 extra = texture(uExtraMap, vTextureCoord).xyz;

    // noise force
    vec3 acc = vec3(0.0);
    vec3 noise = curlNoise(pos * 0.2 + uTime * 0.1);
    acc += noise;

    // pull back to center
    float maxRadius = 5.0;
    float distToCenter = length(pos);
    vec3 dir = -normalize(pos);
    float f = smoothstep(maxRadius * 0.5, maxRadius, distToCenter);
    acc += dir * f * 1.8;

    vel += acc * 0.001;
    float speed = mix(1.0, 4.0, extra.x);
    pos += vel * speed;
    vel *= 0.9;


    oFragColor0 = vec4(pos, 1.0);
    oFragColor1 = vec4(vel, 1.0);
    oFragColor2 = vec4(extra, 1.0);
}