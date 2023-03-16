import {
  GL,
  Geom,
  Draw,
  DrawBall,
  Object3D,
  DrawAxis,
  DrawCopy,
  Scene,
} from "alfrid";
import resize from "./utils/resize";
import { saveImage, getDateString } from "./utils";
import Config from "./Config";
import Assets from "./Assets";

import vs from "shaders/square.vert";
import fs from "shaders/square.frag";
import fsEnv from "shaders/env.frag";

let hasSaved = false;
let canSave = false;

class SceneApp extends Scene {
  constructor() {
    super();

    this.container = new Object3D();

    this.orbitalControl.radius.setTo(5);

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

    this._draw = new Draw().setMesh(Geom.plane(1, 1, 1)).useProgram(vs, fs);

    this._drawEnv = new Draw()
      .setMesh(Geom.sphere(5, 24, true))
      .useProgram(vs, fsEnv);
  }

  update() {}

  render() {
    let g = 0;
    GL.clear(0, 0, 0, 1);
    GL.setMatrices(this.camera);

    GL.enable(GL.DEPTH_TEST);

    this._dAxis.draw();

    GL.enableAdditiveBlending();
    this.container.x = 0;
    this.container.y = 0;
    this.container.z = 0;
    GL.setModelMatrix(this.container.matrix);
    this._draw.uniform("uColor", [0, 0.5, 1]).uniform("uOpacity", 1).draw();

    g = 0.5;
    this.container.x = g;
    this.container.y = g;
    this.container.z = g;
    GL.setModelMatrix(this.container.matrix);
    this._draw.uniform("uColor", [1, 0.5, 0]).uniform("uOpacity", 1).draw();

    GL.enableAlphaBlending();

    if (canSave && !hasSaved && Config.autoSave) {
      saveImage(GL.canvas, getDateString());
      hasSaved = true;
    }
  }

  resize() {
    const { innerWidth: w, innerHeight: h, devicePixelRatio } = window;
    // resize(GL.canvas, w, h, GL);
    GL.setSize(w, h);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;
