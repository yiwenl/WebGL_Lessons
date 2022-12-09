import { GL, Geom, Draw, DrawBall, DrawAxis, DrawCopy, Scene } from "alfrid";
import resize from "./utils/resize";
import { random, saveImage, getDateString } from "./utils";
import Config from "./Config";
import Scheduler from "scheduling";

let hasSaved = false;
let canSave = false;

import vs from "shaders/belt.vert";
import fs from "shaders/belt.frag";

class SceneApp extends Scene {
  constructor() {
    super();

    GL.disable(GL.CULL_FACE);

    // this.orbitalControl.lock();
    this.orbitalControl.rx.value = 0.4;
    this.orbitalControl.ry.value = 0.2;

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

    const w = 6;
    const h = 0.05;
    const mesh = Geom.plane(w, h, 100, "xz");

    const numLines = 100;
    const gap = 0.1;
    const offset = numLines * gap * 0.5;
    const positions = [];
    for (let i = 0; i < numLines; i++) {
      let z = gap * i - offset;
      positions.push([0, 0, z]);
    }
    mesh.bufferInstance(positions, "aPosOffset");

    this._drawBelts = new Draw()
      .setMesh(mesh)
      .useProgram(vs, fs)
      .uniform("uSeedShift", random());
  }

  update() {}

  render() {
    let g = 0.1;
    GL.clear(g, g, g, 1);
    GL.setMatrices(this.camera);

    this._dAxis.draw();
    this._drawBelts.uniform("uTime", Scheduler.getElapsedTime()).draw();

    if (canSave && !hasSaved && Config.autoSave) {
      saveImage(GL.canvas, getDateString());
      hasSaved = true;
    }
  }

  resize() {
    const { innerWidth: w, innerHeight: h, devicePixelRatio } = window;
    const canvasScale = 2;
    let s = Math.max(canvasScale, devicePixelRatio);
    s = 2;
    const width = w;
    const height = h;
    resize(GL.canvas, width * s, height * s, GL);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;
