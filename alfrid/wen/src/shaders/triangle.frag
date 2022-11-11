precision highp float;
varying vec3 vColor;

uniform float uBrightness;
uniform vec2 uResolution;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void) {

    // gl_FragColor = vec4(vColor * uBrightness, 1.0);
    gl_FragColor = vec4(vColor, 1.0);

    // gl_FragColor = vec4(gl_FragCoord.xy/uResolution, 0.0, 1.0);


    // float g = rand(gl_FragCoord.xy/uResolution);
    // gl_FragColor = vec4(vec3(g), 1.0);
}