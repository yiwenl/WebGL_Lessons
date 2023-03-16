import { GL, Geom, Draw, DrawBall, DrawAxis, DrawCopy, Scene } from "alfrid";
import resize from "./utils/resize";
import { saveImage, getDateString } from "./utils";
import Config from "./Config";
import Assets from "./Assets";

import vs from "shaders/light.vert";
import fs from "shaders/light.frag";

let hasSaved = false;
let canSave = false;

class SceneApp extends Scene {
  constructor() {
    super();

    // this.orbitalControl.lock();
    this.orbitalControl.rx.value = 0.3;
    this.orbitalControl.ry.value = 0.3;
    this.light = [0.5, 0.5, 0.5].map((v) => v * 2);

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
    this.draw = new Draw()
      .setMesh(Geom.plane(s, s, 1, "xz"))
      // .setMesh(Geom.sphere(1, 24))
      .useProgram(vs, fs)
      .bindTexture("uNormalMap", Assets.get("normal"), 0);
  }

  update() {}

  render() {
    let g = 0.1;
    GL.clear(g, g, g, 1);
    GL.setMatrices(this.camera);

    this._dAxis.draw();
    this.draw.uniform("uLight", this.light).draw();

    this._dBall.draw(this.light, [g, g, g], [1, 1, 0]);

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
