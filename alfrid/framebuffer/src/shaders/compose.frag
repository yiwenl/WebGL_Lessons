// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D uMap;
uniform sampler2D uBlurMap;

void main(void) {
    vec4 color = texture2D(uMap, vTextureCoord);
    vec3 blur = texture2D(uBlurMap, vTextureCoord).rgb;
    color.rgb *= blur.r;
    gl_FragColor = color;
}