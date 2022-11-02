module.exports = `
precision mediump float;
varying vec2 vUV;
varying float vNoise;
uniform vec3 uTranslate;


const vec3 color0 = vec3(81.0, 142.0, 166.0)/255.0;
const vec3 color1 = vec3(242.0, 205.0, 196.0)/255.0;
const vec3 color2 = vec3(242.0, 181.0, 107.0)/255.0;
const vec3 color3 = vec3(242.0, 162.0, 133.0)/255.0;
const vec3 color4 = vec3(242.0, 239.0, 233.0)/255.0;


void main() {
  float noise = floor(vNoise * 5.0) / 5.0;

  vec3 color = vec3(0.0);

  if(noise < 0.1) {
    color = color0;
  } else if(noise < 0.3) {
    color = color1;
  } else if(noise < 0.5) {
    color = color2;
  } else if(noise < 0.7) {
    color = color3;
  } else {
    color = color4;
  }


  vec3 LIGHT = vec3(1.0, .8, .6);

  gl_FragColor = vec4(color, 1.0);
}`
