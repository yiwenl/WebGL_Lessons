// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;

void main(void) {
    float distToCenter = distance(gl_PointCoord, vec2(.5));
    if(distToCenter > 0.5) discard;
    gl_FragColor = vec4(gl_PointCoord, 0.0, 1.0);
}