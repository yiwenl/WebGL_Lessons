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
var eye = [0, 0, 2]
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
// we add the event listener to the 'window' which is the root of everything
// the name of the event is 'mousemove'
// once the event is triggered the function will get called
window.addEventListener('mousemove', function (event) {
  var x = event.clientX // get the mosue position from the event
  var y = event.clientY
  // the range of x is from 0 to the width of the window ( window.innerWidth )
  // 0 is the left, window.innerWidth is the right
  // the range of y is from 0 to the height of the window ( window.innerHeight )
  // 0 is the top, window.innerHeight is the right
  console.log('Mouse X :', x, '/', window.innerWidth, 'Mouse Y :', y, '/', window.innerHeight)

  // map the mouse position to camera position
  // mapping the x from (0, window.innerWidth) to (-5, 5)
  mouseX = map(x, 0, window.innerWidth, -5, 5)
  // mapping the y from (0, window.innerHeight) to (-5, 5)
  // add negative because in 3D world y is flipped ( when y increase it goes up )
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

// setup the uniform for time
uniform float uTime;

// setup the uniforms for projection / view matrix
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

// setup varying to pass the color to the fragment color
varying vec3 vColor;

void main() {
  vec3 pos = aPosition;
  pos.x += sin(uTime) * 0.5;

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

// create the draw call, update the count to 6 because we are drawing 2 triangles instead of 1 now
// adding the uniform setup to the draw call
// now adding 2 more uniforms for projection matrix & view matrix
var drawTriangle = regl({
  uniforms: {
    // the 'uTime' is the uniform name you are going to use in the shaders
    // regl.prop('time') means you are looking for the 'time' variable
    // in the object you are passing into your draw call
    uTime: regl.prop('time'),
    uProjectionMatrix: regl.prop('projection'),
    uViewMatrix: regl.prop('view')
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
  var eye = [mouseX, mouseY, 2]
  var center = [0, 0, 0]
  var up = [0, 1, 0]
  mat4.lookAt(viewMatrix, eye, center, up)

  // create an object for uniform
  var obj = {
    time: currTime,
    projection: projectionMatrix,
    view: viewMatrix
  }

  // draw the triangle, don't forget the pass the obj in for uniform
  drawTriangle(obj)

  // make it loop
  window.requestAnimationFrame(render)
}

render()
