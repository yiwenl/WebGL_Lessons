import {
  GL,
  Geom,
  Draw,
  Mesh,
  DrawBall,
  DrawAxis,
  DrawCopy,
  Scene,
} from "alfrid";
import resize from "./utils/resize";
import { random, saveImage, getDateString } from "./utils";
import Config from "./Config";

import vs from "shaders/basic.vert";
import fs from "shaders/points.frag";

import vsPlane from "shaders/plane.vert";
import fsPlane from "shaders/plane.frag";

let hasSaved = false;
let canSave = false;

class SceneApp extends Scene {
  constructor() {
    super();

    // this.orbitalControl.lock();

    this.resize();

    setTimeout(() => {
      canSave = true;
    }, 500);
  }

  _initTextures() {}

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();

    const positions = [];
    const extras = [];
    const indices = [];
    let num = 1000;
    const r = 2;
    while (num--) {
      positions.push([random(-r, r), random(-r, r), random(-r, r)]);
      extras.push([random(), random(), random()]);
      indices.push(num);
    }

    const mesh = new Mesh(GL.POINTS)
      .bufferVertex(positions)
      .bufferData(extras, "aExtra")
      .bufferIndex(indices);
    // GL.TRIANGLES
    this._drawPoints = new Draw().setMesh(mesh).useProgram(vs, fs);

    const s = 0.1;
    const mesh2 = Geom.plane(s, s, 1);
    const posOffsets = [];
    const randoms = [];
    num = 1000;
    while (num--) {
      posOffsets.push([random(-r, r), random(-r, r), random(-r, r)]);
      randoms.push([random(), random(), random()]);
    }
    mesh2
      .bufferInstance(posOffsets, "aPosOffset")
      .bufferInstance(randoms, "aRandom");

    this._drawPoints2 = new Draw().setMesh(mesh2).useProgram(vsPlane, fsPlane);
  }

  update() {}

  render() {
    let g = 0.1;
    GL.clear(g, g, g, 1);
    GL.setMatrices(this.camera);

    this._dAxis.draw();
    this._drawPoints.uniform("uViewport", [GL.width, GL.height]).draw();
    // this._drawPoints2.draw();

    if (canSave && !hasSaved && Config.autoSave) {
      saveImage(GL.canvas, getDateString());
      hasSaved = true;
    }
  }

  resize() {
    const { innerWidth: w, innerHeight: h, devicePixelRatio } = window;
    const canvasScale = 2;
    let s = Math.max(canvasScale, devicePixelRatio);
    s = 1;
    const width = w;
    const height = h;
    // resize(GL.canvas, width * s, height * s, GL);
    GL.setSize(width, height);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;
