// basic.vert

precision highp float;
attribute vec3 aVertexPosition;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D uPosMap;

varying vec3 vColor;

void main(void) {
    vec3 pos = texture2D(uPosMap, aVertexPosition.xy).xyz;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);

    gl_PointSize = mix(1.0, 5.0, aVertexPosition.x);

    vColor = pos;
}