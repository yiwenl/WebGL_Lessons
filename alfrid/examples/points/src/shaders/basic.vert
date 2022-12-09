// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aExtra;

uniform vec2 uViewport;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

float particleSize(vec4 screenPos, mat4 mtxProj, vec2 viewport, float radius) {
	return viewport.y * mtxProj[1][1] * radius / screenPos.w;
}

void main(void) {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);

    gl_PointSize = particleSize(gl_Position, uProjectionMatrix, uViewport, 0.02) * mix(1.0, 3.0, aExtra.x);
}