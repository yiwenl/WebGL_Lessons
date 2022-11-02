// ********************************
// I'm cleaning some of the comments as it start getting messy.
// If there's any confusing points please go back to previous files for the comments
// ********************************

var regl = require('regl')()
var glm = require('gl-matrix')
var mat4 = glm.mat4

// create the projection matrix for field of view
var projectionMatrix = mat4.create()
var fov = 75 * Math.PI / 180
var aspect = window.innerWidth / window.innerHeight
var near = 0.01
var far = 1000
mat4.perspective(projectionMatrix, fov, aspect, near, far)

// create the view matrix for defining where the camera is looking at
var viewMatrix = mat4.create()
var eye = [0, 0, 5]
var center = [0, 0, 0]
var up = [0, 1, 0]
mat4.lookAt(viewMatrix, eye, center, up)

var clear = () => {
  regl.clear({
    color: [1, 1, 1, 1] // white
  })
}

var currTime = 0
var r = 0.5
var mouseX = 0
var mouseY = 0

// create mapping function to map the mouse position to camera position
function map (value, start, end, newStart, newEnd) {
  var percent = (value - start) / (end - start)
  if (percent < 0) {
    percent = 0
  }
  if (percent > 1) {
    percent = 1
  }
  var newValue = newStart + (newEnd - newStart) * percent
  return newValue
}

// create event listener for mouse move event in order to get mouse position

window.addEventListener('mousemove', function (event) {
  var x = event.clientX // get the mosue position from the event
  var y = event.clientY

  mouseX = map(x, 0, window.innerWidth, -5, 5)
  mouseY = -map(y, 0, window.innerHeight, -5, 5)
})

// define the points position
var points = [
  [-r, r, 0],
  [r, r, 0],
  [r, -r, 0],

  [-r, r, 0],
  [r, -r, 0],
  [-r, -r, 0]
]

// define the color of each point
var colors = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],

  [1, 0, 0],
  [0, 0, 1],
  [1, 1, 0]
]

// create attributes, now adding the extra attribue for color
var attributes = {
  aPosition: regl.buffer(points),
  aColor: regl.buffer(colors)
}

// create the vertex shader
var vertStr = `
precision mediump float;
attribute vec3 aPosition;
attribute vec3 aColor;

// setup the uniforms for projection / view matrix
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

// setup the uniform for time
uniform float uTime;
// setup the uniform for translate
uniform vec3 uTranslate;

// setup varying to pass the color to the fragment color
varying vec3 vColor;

void main() {
  vec3 pos = aPosition;

  // add the translate to the position
  pos += uTranslate;

  gl_Position = uProjectionMatrix * uViewMatrix * vec4(pos, 1.0);

  vColor = aColor;
}`

// create the fragment shader
var fragStr = `
precision mediump float;
varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, 1.0);
}`

// create the draw call
// adding a new uniform 'uTranslate' to move the squre
var drawTriangle = regl({
  uniforms: {
    uTime: regl.prop('time'),
    uProjectionMatrix: regl.prop('projection'),
    uViewMatrix: regl.prop('view'),
    uTranslate: regl.prop('translate')
  },
  frag: fragStr,
  vert: vertStr,
  attributes: attributes,
  count: 6
})

function render () {
  currTime += 0.01

  // clear the background
  clear()

  // recalculate the view matrix because we are constantly moving the camera position now
  // use mouseX, mouseY for the position of camera
  var eye = [mouseX, mouseY, 5]
  var center = [0, 0, 0]
  var up = [0, 1, 0]
  mat4.lookAt(viewMatrix, eye, center, up)

  // draw 10 squares on x and 10 squares on y
  // therefor we need to create 2 for loops
  // and make sure you move the drawTriangle call to the deepest loop
  var num = 10

  // move the squares to center the whole thing
  var start = num / 2

  for (var i = 0; i < num; i++) {
    for (var j = 0; j < num; j++) {
      // create an object for uniform
      var obj = {
        time: currTime,
        projection: projectionMatrix,
        view: viewMatrix,
        translate: [-start + i, -start + j, 0]
      }

      // draw the triangle, don't forget the pass the obj in for uniform
      drawTriangle(obj)
    }
  }

  // make it loop
  window.requestAnimationFrame(render)
}

render()
