import { GL, Mesh, GLShader } from "alfrid";
import { random } from "./utils";
import { mat4 } from "gl-matrix";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
GL.init(canvas);
const { innerWidth, innerHeight } = window;

// shaders
import vs from "shaders/basic.vert";
import fs from "shaders/triangle.frag";

// camera
const projMatrix = mat4.create();
const viewMatrix = mat4.create();

// projection matrix ( camera perspective )
const fov = (90 * Math.PI) / 180;
const aspectRatio = innerWidth / innerHeight;
const near = 0.1;
const far = 1000;
mat4.perspective(projMatrix, fov, aspectRatio, near, far);

// view matrix ( camera position / direction )
const radius = 1;
const updateCamera = (x = 0, y = 0) => {
  mat4.lookAt(viewMatrix, [x, y, radius], [0, 0, 0], [0, 1, 0]);
};
updateCamera();

// interaction
window.addEventListener("mousemove", ({ clientX, clientY }) => {
  const { innerWidth, innerHeight } = window;
  const range = 2;
  const x = ((clientX / innerWidth) * 2 - 1) * range;
  const y = ((1 - clientY / innerHeight) * 2 - 1) * range;

  // update camera
  updateCamera(x, y);

  // refresh
  render();
});

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

// render
const render = () => {
  // clear
  GL.clear(0, 0, 0, 1);
  // bind shader
  shader.bind();
  shader
    .uniform("uProjMatrix", "mat4", projMatrix)
    .uniform("uViewMatrix", "mat4", viewMatrix)
    .uniform("uOffset", "vec3", [0, 0, 0])
    .uniform("uScale", "float", 1)
    .uniform("uBrightness", "float", 0);

  // draw mesh
  GL.draw(mesh);
};

render();

// resize
const resize = () => {
  const { innerWidth, innerHeight } = window;
  GL.setSize(innerWidth, innerHeight);

  // update projection matrix
  mat4.perspective(projMatrix, fov, innerWidth / innerHeight, near, far);

  // refresh
  render();
};

resize();
window.addEventListener("resize", resize);
