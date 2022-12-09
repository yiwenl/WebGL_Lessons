// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;

void main(void) {
    if(distance(vTextureCoord, vec2(0.5)) > .5) discard;
    gl_FragColor = vec4(vTextureCoord, 0.0, 1.0);
}