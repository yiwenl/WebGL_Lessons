// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aPosOffset;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform float uSeedScale;
uniform float uTime;

varying vec2 vUV;

#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)
#pragma glslify: fbm    = require(./glsl-utils/fbm/3d.glsl)
#pragma glslify: rotate    = require(./glsl-utils/rotate.glsl)

#define PI 3.141592653


void main(void) {
    // snoise(vec3(0.0, 0.0, 0.0));
    float scale = snoise(vec3(aPosOffset.xy * 0.25, uTime) * 2.0 + uSeedScale) * .5 + 0.5;  
    scale = mix(0.01, 3.0, scale);
    float rot = snoise(vec3(aPosOffset.xy * 0.25, uTime)) * PI;
    vec3 pos = aVertexPosition;
    pos.y *= scale;
    pos.xy = rotate(pos.xy, rot);

    pos += aPosOffset;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);

    vUV = aTextureCoord;
}
