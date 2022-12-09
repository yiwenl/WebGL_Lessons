import {
  GL,
  CameraPerspective,
  CameraOrtho,
  OrbitalControl,
  GLShader,
  Geom,
  Object3D,
  DrawAxis,
} from "alfrid";
import { random } from "./utils";
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
GL.init(canvas);

import { mat3, mat4 } from "gl-matrix";

// shaders
import vs from "shaders/basic.vert";
import fs from "shaders/diffuse.frag";

// resize
const resize = () => {
  const { innerWidth, innerHeight } = window;
  GL.setSize(innerWidth, innerHeight);
};

// time
let time = 0;

// scene graph
const containerA = new Object3D();
const containerB = new Object3D();
containerA.x = 2;
containerB.scaleY = 0.5;
containerA.addChild(containerB);

resize();
window.addEventListener("resize", resize);

// camera
const camera = new CameraPerspective();
camera.setPerspective(Math.PI / 2, GL.aspectRatio, 0.1, 1000);
// const orbControl = new OrbitalControl(camera, GL.canvans, 10);

GL.disable(GL.CULL_FACE);
const cameraTop = new CameraOrtho();
const w = 5;
const h = w / GL.aspectRatio;
cameraTop.ortho(-w, w, h, -h, 0.1, 1000);
cameraTop.lookAt([10, 10, 20], [0, 0, 0]);

// model matrix
const mtxModel = mat4.create();
mat4.translate(mtxModel, mtxModel, [1, 0, 0]);

// seed
let seed = random(100);

// shader
const shader = new GLShader(vs, fs);

// geometry
const cube = Geom.cube(1, 1, 1);

let numCubes = 100;
const positions = [];
const extras = [];
const { sin, cos, PI } = Math;
while (numCubes--) {
  const a = random(PI * 2);
  const r = random(6, 2);
  const x = cos(a) * r;
  const y = sin(a) * r;
  const z = random(-1, 1);

  positions.push([x, y, z]);

  const rndX = random();
  const rndY = random();
  const rndZ = random();
  extras.push([rndX, rndY, rndZ]);
}

cube.bufferInstance(positions, "aPosOffset").bufferInstance(extras, "aExtra");

// helper
const dAxis = new DrawAxis();

GL.enable(GL.DEPTH_TEST);

const loop = () => {
  containerA.update();

  time += 0.01;
  // clear
  GL.clear(0, 0, 0, 1);

  // GL.setMatrices(camera);
  GL.setMatrices(cameraTop);
  dAxis.draw();

  // GL.setModelMatrix(containerB.matrix);
  shader.bind();
  shader.uniform("uTime", time).uniform("uSeed", seed);
  GL.draw(cube);

  window.requestAnimationFrame(loop);
};

loop();

const canvasTest = document.createElement("canvas");
const ctx = canvasTest.getContext("2d");
console.log("Contest", ctx);
