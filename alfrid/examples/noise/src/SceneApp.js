import { GL, Geom, Draw, DrawBall, DrawAxis, DrawCopy, Scene } from "alfrid";
import resize from "./utils/resize";
import { random, saveImage, getDateString } from "./utils";
import Config from "./Config";

let hasSaved = false;
let canSave = false;

import vs from "shaders/basic.vert";
import fs from "shaders/noise.frag";

class SceneApp extends Scene {
  constructor() {
    super();

    // this.orbitalControl.lock();
    this.orbitalControl.radius.setTo(10);

    this.resize();
    this.time = 0;

    setTimeout(() => {
      canSave = true;
    }, 500);
  }

  _initTextures() {}

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();

    const s = 5;
    this._drawNoise = new Draw()
      .setMesh(Geom.plane(s, s, 1, "xy"))
      .useProgram(vs, fs)
      .uniform("uSeed", random());
  }

  update() {}

  render() {
    this.time += 0.01;
    let g = 0.1;
    GL.clear(g, g, g, 1);
    GL.setMatrices(this.camera);

    this._dAxis.draw();
    this._drawNoise.uniform("uTime", this.time).draw();

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
    resize(GL.canvas, width * s, height * s, GL);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;
