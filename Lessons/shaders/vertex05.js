// module.exports is the preserved word for exporting
// copy & paste the vertex shader from javascript file

module.exports = `
precision mediump float;
attribute vec3 aPosition;
attribute vec2 aUV;

// setup the uniforms for projection / view matrix
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

uniform float uTime;

// setup varying to pass the uv to the fragment
varying vec2 vUV;

void main() {
  gl_Position = uProjectionMatrix * uViewMatrix * vec4(aPosition, 1.0);

  // passing the UV to fragment shader
  vUV = aUV;
}`
