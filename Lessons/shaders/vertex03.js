// module.exports is the preserved word for exporting
// copy & paste the vertex shader from javascript file

module.exports = `
precision mediump float;
attribute vec3 aPosition;
attribute vec2 aUV;

// setup the uniforms for projection / view matrix
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

// setup the uniform for time
uniform float uTime;
// setup the uniform for translate
uniform vec3 uTranslate;

// setup varying to pass the uv to the fragment
varying vec2 vUV;

void main() {
  vec3 pos = aPosition;

  // add the translate to the position
  pos += uTranslate;

  gl_Position = uProjectionMatrix * uViewMatrix * vec4(pos, 1.0);

  vUV = aUV;
}`
