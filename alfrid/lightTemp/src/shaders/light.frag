// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTextureCoord;

uniform vec3 uLight;
uniform sampler2D uNormalMap;

void main(void) {

    vec3 normal = texture2D(uNormalMap, vTextureCoord).rgb;

    vec3 lightDir = normalize(uLight - vPosition);

    vec3 newNormal = vNormal + normal * 0.1;
    newNormal = normalize(newNormal);

    float dotValue = max(dot(normalize(lightDir), newNormal), 0.0);
    // dotValue = pow(dotValue, 32.0);
    gl_FragColor = vec4(vec3(dotValue),1.0);
    // gl_FragColor = vec4(nomral,1.0);
}