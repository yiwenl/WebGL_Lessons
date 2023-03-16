precision highp float;
varying vec2 vTextureCoord;
varying vec4 vShadowCoord;

uniform sampler2D uDepthMap;

void main(void) {
    vec4 shadowCoord = vShadowCoord / vShadowCoord.w;
    vec2 uv = shadowCoord.xy * .5 + .5; // -1 ~ 1 -> 0 ~ 1

    float bias = 0.01;
    float depth = texture2D(uDepthMap, uv).r;
    float g = shadowCoord.z < depth - bias? 1.0 : 0.0;

    gl_FragColor = vec4(vec3(g), 1.0);
    // gl_FragColor = texture2D(uDepthMap, uv);
}