// In this lesson we are going to load a texture and apply on a square

// ********************************
// I'm cleaning some of the comments as it start getting messy.
// If there's any confusing points please go back to previous files for the comments
// ********************************

var regl = require('regl')()
var glm = require('gl-matrix')
var mat4 = glm.mat4

// import the shader from external files
// again we are using different shader again for random scale / colors
// make sure you are looking at the right shader
var vertStr = require('./shaders/vertex05.js')
var fragStr = require('./shaders/fragment05.js')

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

  mouseX = map(x, 0, window.innerWidth, -25, 25)
  mouseY = -map(y, 0, window.innerHeight, -25, 25)
})

// create texture
let texture
let imageLoaded = false

// create image
var img = new Image()

img.onload = function () {
  console.log('Image loaded', this)
  texture = regl.texture(this)
  imageLoaded = true
}

console.log('Set the source of the image, this will load the image')
img.src = './assets/image.jpg'

// setting up the attribute, we will need the position attribue and the uv attribute
var r = 3
var positions = [
  [-r, r, 0],
  [r, r, 0],
  [r, -r, 0],

  [-r, r, 0],
  [r, -r, 0],
  [-r, -r, 0]
]

var uvs = [
  [0, 0],
  [1, 0],
  [1, 1],

  [0, 0],
  [1, 1],
  [0, 1]
]

// create attributes
const attributes = {
  aPosition: regl.buffer(positions),
  aUV: regl.buffer(uvs)
}

// create the draw call for the plane
var drawPlane = regl({
  uniforms: {
    uTime: regl.prop('time'),
    uProjectionMatrix: regl.prop('projection'),
    uViewMatrix: regl.prop('view'),
    texture: regl.prop('texture') // we use uniform to pass in texture
  },
  vert: vertStr,
  frag: fragStr,
  attributes: attributes,
  count: 6
})

function render () {
  currTime += 0.01

  // clear the background
  clear()

  // recalculate the view matrix because we are constantly moving the camera position now
  // use mouseX, mouseY for the position of camera
  var eye = [mouseX, mouseY, 10]
  var center = [0, 0, 0]
  var up = [0, 1, 0]
  mat4.lookAt(viewMatrix, eye, center, up)

  // only start drawing when the image is loaded
  if (imageLoaded) {
    var obj = {
      time: currTime,
      projection: projectionMatrix,
      view: viewMatrix,
      texture: texture
    }

    // draw the cube, don't forget the pass the obj in for uniform
    drawPlane(obj)
  }

  // make it loop
  window.requestAnimationFrame(render)
}

render()
