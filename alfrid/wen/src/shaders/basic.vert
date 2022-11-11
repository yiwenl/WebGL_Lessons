// basic.vert
precision highp float;
attribute vec3 aPosition;
attribute vec3 aCenter;
// attribute vec3 aColor;
// attribute vec3 aOffset;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

uniform float offsetX;
uniform float offsetY;
uniform float uTime;

// uniform float uCenter;

varying vec3 vColor;

#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)

void main(void) {
    float scale = snoise(aCenter * 0.5 + uTime * 0.1) * 0.5 + 0.5;
    
    scale = smoothstep(0.2, 0.8, scale);

    vec3 finalPosition = aPosition * scale + aCenter;

    // finalPosition *= scale;

    gl_Position = uProjectionMatrix * uViewMatrix * vec4(finalPosition, 1.0);

    float grey = scale;
    vColor = vec3(grey);
}