import { GL, Draw, Geom, DrawBall, DrawAxis, DrawCopy, Scene } from "alfrid";
import resize from "./utils/resize";
import { saveImage, getDateString } from "./utils";
import Config from "./Config";

import vs from "shaders/basic.vert";
import fs from "shaders/light.frag";

let hasSaved = false;
let canSave = false;

class SceneApp extends Scene {
  constructor() {
    super();

    // this.orbitalControl.lock();
    this.orbitalControl.rx.value = 0.4;
    this.orbitalControl.ry.value = 0.4;

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

    const s = 10;
    this._drawSphere = new Draw()
      // .setMesh(Geom.sphere(1, 24))
      .setMesh(Geom.plane(s, s, 1, "xz"))
      .useProgram(vs, fs);
  }

  update() {}

  render() {
    let g = 0.1;
    GL.clear(g, g, g, 1);
    GL.setMatrices(this.camera);

    this._dAxis.draw();
    this._drawSphere.uniform("uLight", [0.5, 0.2, 0.5]).draw();

    if (canSave && !hasSaved && Config.autoSave) {
      saveImage(GL.canvas, getDateString());
      hasSaved = true;
    }
  }

  resize() {
    const { innerWidth: w, innerHeight: h, devicePixelRatio } = window;
    GL.setSize(w, h);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;
