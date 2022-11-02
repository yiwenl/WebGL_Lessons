import { GL, Mesh, GLShader } from "alfrid";
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
GL.init(canvas);

// shaders
import vs from "shaders/basic.vert";
import fs from "shaders/triangle.frag";

// clear
GL.clear(0, 0, 0, 1);

// setup vertices
const r = 1;
const points = [
  [-r, -r, 0],
  [1, -r, 0],
  [0, r, 0],
];
// setup indices
const indices = [0, 1, 2];

// create mesh
const mesh = new Mesh().bufferData(points, "aPosition").bufferIndex(indices);

// create shader
const shader = new GLShader(vs, fs);

// render
const render = () => {
  // clear
  GL.clear(0, 0, 0, 1);

  // bind shader
  shader.bind();

  // draw mesh
  GL.draw(mesh);
};

// resize
const resize = () => {
  const { innerWidth, innerHeight } = window;
  GL.setSize(innerWidth, innerHeight);

  // refresh
  render();
};

resize();
window.addEventListener("resize", resize);

// render
render();
