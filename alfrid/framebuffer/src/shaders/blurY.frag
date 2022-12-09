// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE
#define NUM 5

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;

void main(void) {
    vec3 color = vec3(0.0);
    float gap = 0.002;
    float count = 0.0;
    for( int i = -NUM; i <= NUM; i++ ) {
        vec2 uv = vTextureCoord;
        uv.y += float(i) * gap;
        vec3 pixel = texture2D(texture, uv).rgb;
        color += pixel;
        count += 1.0;
    }

    color /= count;

    gl_FragColor = vec4(color, 1.0);
}