// In this lesson we are going to setup an extra attribute 'aCenter' to help us
// create the animation. We want to scale each triangle from its center therefore
// for each triangle we add all the 3 points then divide by 3 to get the center point
// Then we create a new attribute using this center but need to make sure push 3
// times so all 3 points of a triangle will have the same center.
const regl = require('regl')()
const loadObj = require('./utils/loadObj.js')
const glm = require('gl-matrix')

const strVert = require('./shaders/vertBauhaus2.js')
const strFrag = require('./shaders/fragBauhaus2.js')

var mat4 = glm.mat4

// camera
var projectionMatrix = mat4.create()
var fov = 75 * Math.PI / 180
var aspect = window.innerWidth / window.innerHeight
mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.0)

var viewMatrix = mat4.create()
mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0])

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

  mouseX = map(x, 0, window.innerWidth, -5, 5)
  mouseY = -map(y, 0, window.innerHeight, -5, 5)
})

var hasModelLoaded = false
var drawTriangle

// loading the 3D model
loadObj('./assets/sphere36.obj', function (o) {
  var centers = []

  // looping through the triangles: every 3 points makes a triangle
  /*
  positions = [
    A,
    B,
    C,
    D,
    E,
    F,
    ...
  ]
  so point A, point B, point C will make a triangle,
  point D, point E, point F will make another triangle and so on
  */
  for (var i = 0; i < o.positions.length; i += 3) {
    var a = o.positions[i]
    var b = o.positions[i + 1]
    var c = o.positions[i + 2]

    // averaging the X, Y, Z of 3 points
    var cX = (a[0] + b[0] + c[0]) / 3
    var cY = (a[1] + b[1] + c[1]) / 3
    var cZ = (a[2] + b[2] + c[2]) / 3

    // create the center and then pushing to the centers array to create the buffer/attribute
    // remember to push 3 times because you need it for each point of the triangle
    var center = [cX, cY, cZ]
    centers.push(center)
    centers.push(center)
    centers.push(center)
  }
  // in the end the length of the centers array should be the same as the length of your position array
  console.log(o.positions.length, centers.length)

  // setup the attributes, now adding 'aCenter'
  const attributes = {
    aPosition: regl.buffer(o.positions),
    aCenter: regl.buffer(centers),
    aUV: regl.buffer(o.uvs)
  }

  drawTriangle = regl({
    uniforms: {
      uTime: regl.prop('time'),
      uProjectionMatrix: regl.prop('projection'),
      uViewMatrix: regl.prop('view'),
      uTranslate: regl.prop('translate')
    },
    vert: strVert,
    frag: strFrag,
    attributes: attributes,
    count: o.count
  })

  hasModelLoaded = true
})

const clear = () => {
  regl.clear({
    color: [0, 0, 0, 0]
  })
}

function render () {
  if (!hasModelLoaded) {
    window.requestAnimationFrame(render)
    return
  }
  currTime += 0.01

  // recalculate the view matrix because we are constantly moving the camera position now
  // use mouseX, mouseY for the position of camera
  var eye = [mouseX, mouseY, 3]
  var center = [0, 0, 0]
  var up = [0, 1, 0]
  mat4.lookAt(viewMatrix, eye, center, up)

  clear()

  var num = 10
  var s = 3
  var start = num / 2 * s

  var obj = {
    time: currTime,
    view: viewMatrix,
    projection: projectionMatrix,
    translate: [0, 0, 0]
  }

  drawTriangle(obj)

  window.requestAnimationFrame(render)
}

render()

window.addEventListener('resize', function () {
  regl.poll()
  var fov = 75 * Math.PI / 180
  var aspect = window.innerWidth / window.innerHeight
  mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.0)
})
