import { GL, Mesh, GLShader } from "alfrid";
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
GL.init(canvas);

// shaders
import vs from "shaders/basic.vert";
import fs from "shaders/triangle.frag";

// resize
const resize = () => {
  const { innerWidth, innerHeight } = window;
  GL.setSize(innerWidth, innerHeight);
};

resize();
window.addEventListener("resize", resize);

// clear
GL.clear(0, 0, 0, 1);

// setup vertices
const r = 0.5;
const points = [
  [-r, -r, 0],
  [r, -r, 0],
  [r, r, 0],
  [-r, r, 0],
];

// setup colors
const t = 0;
const colors = [
  [1, t, t],
  [t, 1, t],
  [t, t, 1],
  [1, 1, t],
];

// setup indices, drawing 2 triangles
const indices = [0, 1, 2, 0, 2, 3];

// create mesh
const mesh = new Mesh()
  .bufferData(points, "aPosition")
  .bufferData(colors, "aColor")
  .bufferIndex(indices);

// create shader
const shader = new GLShader(vs, fs);

// bind shader
shader.bind();

// draw mesh
GL.draw(mesh);
