// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vNormal;
varying vec3 vPosition;
uniform vec3 uLight;

void main(void) {
    float d = dot(normalize(uLight), vNormal);


    vec3 dirToLight = uLight - vPosition;
    d = dot(normalize(dirToLight), vNormal);

    // gl_FragColor = vec4(vDiffuse, 1.0);
    gl_FragColor = vec4(vec3(d), 1.0);
}