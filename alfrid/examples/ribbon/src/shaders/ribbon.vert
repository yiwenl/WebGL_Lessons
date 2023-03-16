#version 300 es

precision highp float;
in vec3 aExtra;
in vec2 aTextureCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform vec3 uStart;
uniform vec3 uCtrl0;
uniform vec3 uCtrl1;
uniform vec3 uEnd;
uniform float uTime;

uniform int num;

out vec2 vTextureCoord;
out vec3 vNormal;

#pragma glslify: bezier    = require(./glsl-utils/bezier.glsl)
#pragma glslify: rotate    = require(./glsl-utils/rotate.glsl)

#define PI 3.141592653
#define K 2.0;

#define NUM ${NUM}

void main() {
    float scale = mix(0.1, 1.0, aExtra.x) * 0.1;
    float radius = 0.1 * sin(aTextureCoord.x * PI) * scale;
    vec3 pos = vec3(0.0, radius, 0.0);
    pos.yz = rotate(pos.yz, aTextureCoord.y * PI * 2.0);

    float range = 2.0;
    vec3 start = uStart + (aExtra.xyz - 0.5) * range;
    vec3 end = uEnd + (aExtra.zxy - 0.5) * range;


    for(int i =0; i<NUM; i++ ) {

    }
    

    vec3 ctrl0 = uCtrl0;
    vec3 ctrl1 = uCtrl1;
    ctrl0.xy = rotate(ctrl0.xy, uTime * 0.3);
    ctrl1.xy = rotate(ctrl1.xy, -uTime * 0.4);

    vec3 posOffset = bezier(start, ctrl0, ctrl1, end, aTextureCoord.x);
    vec3 posNext = bezier(start, ctrl0, ctrl1, end, aTextureCoord.x + 0.05);
    vec3 dir = normalize(posNext - posOffset);
    vec3 xAxis = vec3(1.0, 0.0, 0.0);

    // rotation axis
    vec3 axis = cross(dir, xAxis);
    float angle = acos(dot(dir, xAxis));

    pos = rotate(pos, axis, angle);

    pos += posOffset;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;


    // noraml
    vec3 n = vec3(0.0, 1.0, 0.0);
    n.yz = rotate(n.yz, aTextureCoord.y * PI * 2.0);
    n = rotate(n, axis, angle);

    vNormal = n;
}