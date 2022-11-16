precision highp float;
varying vec2 vUV;
uniform sampler2D uMap;

void main(void) {
    gl_FragColor = texture2D(uMap, vUV);
    // gl_FragColor = vec4(vUV, 0.0, 1.0);
}