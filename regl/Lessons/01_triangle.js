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

// create attributes
var attributes = {
  aPosition: regl.buffer(points)
}

// create the vertex shader
var vertStr = `
precision mediump float;
attribute vec3 aPosition;

void main() {
  gl_Position = vec4(aPosition, 1.0);
}`

// create the fragment shader, output red color
var fragStr = `
precision mediump float;

void main() {
  // showing red
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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
