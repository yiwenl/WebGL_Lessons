// import regl
var regl = require('regl')()

// create a clear function to clear the background
var clear = () => {
  regl.clear({
    color: [1, 1, 1, 1] // white
  })
}

// create a variable for time
var currTime = 0

// define the size of the square
var r = 0.5

// define the points position
// now adding the second triangle to form the square
var points = [
  [-r, r, 0],
  [r, r, 0],
  [r, -r, 0],

  [-r, r, 0],
  [r, -r, 0],
  [-r, -r, 0]
]

// define the color of each point
// also adding the color for the second triangle
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

// setup varying to pass the color to the fragment color
varying vec3 vColor;

void main() {
  // we can't modify the attribute, copy the attribute to a new variable 'pos'
  vec3 pos = aPosition;

  // move the triangle left / right with sin function with time
  pos.x += sin(uTime) * 0.5;

  // The output should use the pos instead of the aPosition now
  // Beacuse we are adding the changes to the pos not the aPosition
  gl_Position = vec4(pos, 1.0);

  // assign the color to the varying so we can have it in fragment shader
  vColor = aColor;
}`

// create the fragment shader
var fragStr = `
precision mediump float;
varying vec3 vColor;

void main() {
  // showing the color from varying color
  gl_FragColor = vec4(vColor, 1.0);
}`

// create the draw call, update the count to 6 because we are drawing 2 triangles instead of 1 now
// adding the uniform setup to the draw call
var drawTriangle = regl({
  uniforms: {
    uTime: regl.prop('time')
    // the 'uTime' is the uniform name you are going to use in the shaders
    // regl.prop('time') means you are looking for the 'time' variable
    // in the object you are passing into your draw call
  },
  frag: fragStr,
  vert: vertStr,
  attributes: attributes,
  count: 6
})

// render the triangle
function render () {
  // increase the time
  currTime += 0.01

  // clear the background
  clear()

  // create an object for uniform, and create an variable 'time' inside
  // then assign the currTime to it
  var obj = {
    time: currTime
  }

  // draw the triangle, don't forget the pass the obj in for uniform
  drawTriangle(obj)

  // make it loop
  window.requestAnimationFrame(render)
}

render()
