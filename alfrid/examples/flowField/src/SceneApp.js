import { GL, Geom, Draw, DrawBall, DrawAxis, DrawCopy, Scene } from "alfrid";
import resize from "./utils/resize";
import { random, saveImage, getDateString } from "./utils";
import Config from "./Config";

let hasSaved = false;
let canSave = false;

import vs from "shaders/flow.vert";
import fs from "shaders/flow.frag";

class SceneApp extends Scene {
  constructor() {
    super();
    this.time = random(100);

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

    const ratio = 1;
    const w = 0.2;
    const h = w / ratio;
    const mesh = Geom.plane(w, h, 1, "xy");

    const num = 30;
    const size = 10;
    const gap = size / num;
    const positions = [];
    for (let j = 0; j <= num; j++) {
      for (let i = 0; i <= num; i++) {
        positions.push([i * gap - size / 2, j * gap - size / 2, 0]);
      }
    }
    mesh.bufferInstance(positions, "aPosOffset");

    this._drawFlow = new Draw()
      .setMesh(mesh)
      .useProgram(vs, fs)
      .uniform("uSeedScale", random(100));
  }

  update() {}

  render() {
    // this.time += 0.01;
    let g = 0.1;
    GL.clear(g, g, g, 1);
    GL.setMatrices(this.camera);

    this._dAxis.draw();
    this._drawFlow.uniform("uTime", this.time).draw();

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
