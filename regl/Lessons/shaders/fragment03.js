// module.exports is the preserved word for exporting
// copy & paste the vertex shader from javascript file

module.exports = `
precision mediump float;

// we can get the uniform too in the fragment shader
uniform vec3 uTranslate;

// the same mapping function we use for mapping the mouse position to camera position
float map(float value, float start, float end, float newStart, float newEnd) {
  float percent = (value - start) / (end - start);
  if (percent < 0.0) {
    percent = 0.0;
  }
  if (percent > 1.0) {
    percent = 1.0;
  }
  float newValue = newStart + (newEnd - newStart) * percent;
  return newValue;
} 

void main() {
  // the position of our square goes from -10 ~ 10
  // now map it to 0 ~ 1
  float r = map(uTranslate.x, -10.0, 10.0, 0.0, 1.0);
  float g = map(uTranslate.y, -10.0, 10.0, 0.0, 1.0);
  float b = map(uTranslate.z, -10.0, 10.0, 0.0, 1.0);

  gl_FragColor = vec4(r, g, b, 1.0);
}`
