// module.exports is the preserved word for exporting
// copy & paste the vertex shader from javascript file

module.exports = `
precision mediump float;
varying vec2 vUV;

// setup the uniform for texture
uniform sampler2D texture;
void main() {
  
  gl_FragColor = texture2D(texture, vUV);
}`
