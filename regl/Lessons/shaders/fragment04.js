// module.exports is the preserved word for exporting
// copy & paste the vertex shader from javascript file

module.exports = `
precision mediump float;
varying float vNoise;


void main() {
  
  vec3 colorRed = vec3(1.0, 0.0, 0.0);
  vec3 colorYellow = vec3(1.0, 1.0, 0.0);

  // mix the color based on the noise
  // https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/mix.xhtml
  vec3 finalColor = mix(colorRed, colorYellow, vNoise);

  gl_FragColor = vec4(finalColor, 1.0);
}`
