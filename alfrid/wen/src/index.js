import { GL, Mesh, GLShader } from "alfrid";

import vs from "shaders/basic.vert";
import fs from "shaders/triangle.frag";
import { random } from "./utils";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
GL.init(canvas);

// resize
const resize = () => {
  const { innerWidth, innerHeight } = window;
  GL.setSize(innerWidth, innerHeight);
};

resize();
window.addEventListener("resize", resize);

// clear
GL.clear(1, 0, 0, 1);

// points
let r = 0.75;
const points = [
  [-r, -r, 0],
  [r, -r, 0],
  [0, r, 0],
];

const br = 0.5;
const colors = [
  [1, br, br],
  [br, 1, br],
  [br, br, 1],
];

r = 0.25;
const offsets = [
  [random(-r, r), random(-r, r), 0],
  [random(-r, r), random(-r, r), 0],
  [random(-r, r), random(-r, r), 0],
];
const indices = [0, 1, 2];

// create mesh
const mesh = new Mesh()
  .bufferData(points, "aPosition")
  .bufferData(colors, "aColor")
  .bufferData(offsets, "aOffset")
  .bufferIndex(indices);

// create shader
const shader = new GLShader(vs, fs);

const render = () => {
  GL.clear(0, 0, 0, 1);

  // draw call
  shader.bind();
  GL.draw(mesh);
};

render();
