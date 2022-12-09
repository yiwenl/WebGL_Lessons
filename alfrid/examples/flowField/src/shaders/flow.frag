precision highp float;

varying vec2 vUV;

void main(void) {
    vec2 center = vec2(0.5);
    float distToCenter = distance(vUV, center);
    distToCenter = step(distToCenter, 0.5);
    if(distToCenter == 0.0) {
        discard;
    }

    gl_FragColor = vec4(vec3(distToCenter), 1.0);
}