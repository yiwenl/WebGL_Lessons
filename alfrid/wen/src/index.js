import { GL, Mesh, GLShader } from "alfrid";
import { vec3, mat4 } from "gl-matrix";

import vs from "shaders/basic.vert";
import fs from "shaders/triangle.frag";
import { random } from "./utils";

console.log(vs);

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
GL.init(canvas);
// GL.disable(GL.CULL_FACE);

let time = 0;

const RAD = Math.PI / 180;
const ratio = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 10000;
// shadow mapping / precision

// camera

// projection matrix
const projectionMtx = mat4.create();
mat4.perspective(projectionMtx, 75 * RAD, ratio, near, far);

// view matrix
const eye = [0, 0, 3];
const center = [0, 0, 0];
const up = [0, 1, 0];
const viewMtx = mat4.create();
mat4.lookAt(viewMtx, eye, center, up);

window.addEventListener("mousemove", (e) => {
  let x = (e.clientX / window.innerWidth) * 2 - 1;
  let y = (1 - e.clientY / window.innerHeight) * 2 - 1;
  const radius = 4;
  const eye = [x * radius, y * radius, 3];
  const center = [0, 0, 0];
  const up = [0, 1, 0];
  mat4.lookAt(viewMtx, eye, center, up);
});

// clear
GL.clear(1, 0, 0, 1);

// points
let r = 0.2;

let index = 0;
const indices = [];
const positions = [];
const centers = [];

const addSquare = (x, y) => {
  positions.push([-r, -r, 0]);
  positions.push([r, -r, 0]);
  positions.push([r, r, 0]);
  positions.push([-r, -r, 0]);
  positions.push([r, r, 0]);
  positions.push([-r, r, 0]);

  const tz = 2;
  const z = random(-tz, tz);
  centers.push([x, y, z]);
  centers.push([x, y, z]);
  centers.push([x, y, z]);
  centers.push([x, y, z]);
  centers.push([x, y, z]);
  centers.push([x, y, z]);

  indices.push(index * 6);
  indices.push(index * 6 + 1);
  indices.push(index * 6 + 2);
  indices.push(index * 6 + 3);
  indices.push(index * 6 + 4);
  indices.push(index * 6 + 5);
  index++;
};

let num = 1000;
const positionsOffsets = [];
// addSquare(0, 0);
while (num--) {
  const r = 2;
  addSquare(random(-r, r), random(-r, r));
  // positionsOffsets.push([random(-r, r), random(-r, r)]);
}

// create mesh
const mesh = new Mesh()
  .bufferData(positions, "aPosition")
  .bufferData(centers, "aCenter")
  // .bufferData(colors, "aColor")
  // .bufferData(offsets, "aOffset")
  .bufferIndex(indices);

// create shader
const shader = new GLShader(vs, fs);

const render = () => {
  time += 0.01;
  GL.clear(0, 0, 0, 1);

  // draw call
  shader.bind();
  shader.uniform("offsetX", Math.sin(time) * 0);
  shader.uniform("offsetY", Math.cos(time) * 0);
  shader.uniform("uBrightness", 1);
  shader.uniform("uTime", time);
  shader.uniform("uProjectionMatrix", projectionMtx);
  shader.uniform("uViewMatrix", viewMtx);
  shader.uniform("uResolution", [GL.width, GL.height]);

  // positionsOffsets.forEach((p) => {
  //   shader.uniform("offsetX", p[0]);
  //   shader.uniform("offsetY", p[1]);
  //   GL.draw(mesh);
  // });
  GL.draw(mesh);

  window.requestAnimationFrame(render);
};

render();

// resize
const resize = () => {
  const { innerWidth, innerHeight } = window;
  GL.setSize(innerWidth, innerHeight);

  console.log("resize");
  const ratio = window.innerWidth / window.innerHeight;
  mat4.perspective(projectionMtx, 75 * RAD, ratio, near, far);
};

resize();
window.addEventListener("resize", resize);
