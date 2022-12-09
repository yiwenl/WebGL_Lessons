// copy.frag

// #extension GL_OES_standard_derivatives : enable


#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPos;

void main(void) {
    if(gl_FrontFacing) {
        gl_FragColor = vec4( 1.0);
    } else {
        gl_FragColor = vec4(vec3(0.2), 1.0);
    }
}