// import regl
var regl = require('regl')()

// create a clear function to clear the background
var clear = () => {
  regl.clear({
    color: [1, 1, 1, 1] // white
  })
}

// define the points position
var points = [
  [0, 0.5, 0],
  [0.5, -0.5, 0],
  [-0.5, -0.5, 0]
]

// define the color of each point
var colors = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
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

// setup varying to pass the color to the fragment color
varying vec3 vColor;

void main() {
  gl_Position = vec4(aPosition, 1.0);

  // assign the color to the varying so we can have it in fragment shader
  vColor = aColor;
}`

// create the fragment shader, output red color
var fragStr = `
precision mediump float;
varying vec3 vColor;

void main() {
  // showing the color from varying color
  gl_FragColor = vec4(vColor, 1.0);
}`

// create the draw call
var drawTriangle = regl({
  frag: fragStr,
  vert: vertStr,
  attributes: attributes,
  count: 3
})

// render the triangle
function render () {
  // clear the background
  clear()

  // draw the triangle
  drawTriangle()

  // make it loop
  window.requestAnimationFrame(render)
}
render()
