import { GL, DrawBall, DrawAxis, DrawCopy, Scene } from "alfrid";
import { targetWidth, targetHeight } from "./features";
import resize from "./utils/resize";
import { random, saveImage, getDateString } from "./utils";
import Config from "./Config";

import bezier from "./utils/bezier";
import { vec3 } from "gl-matrix";

import DrawRibbons from "./DrawRibbons";
import Scheduler from "scheduling";

let hasSaved = false;
let canSave = false;

class SceneApp extends Scene {
  constructor() {
    super();
    GL.setSize(targetWidth, targetHeight);
    this.camera.setAspectRatio(GL.aspectRatio);
    resize(GL.canvas, targetWidth, targetHeight);

    // this.orbitalControl.lock();
    this.orbitalControl.rx.value = -0.4;
    this.orbitalControl.ry.value = -0.4;

    const d = 3;
    const r = 4;

    const getCtrlPoint = (x) => {
      return [x, random(-r, r), random(-r, r)];
    };

    const gap = (d * 2) / 3;

    const start = [-d, 0, 0];
    const ctrl0 = getCtrlPoint(-d + gap);
    const ctrl1 = getCtrlPoint(-d + gap * 2);
    const end = [d, 0, 0];

    const theta = random(0.2, 0.5) * Math.PI;
    this.controlPoints = [start, ctrl0, ctrl1, end];
    this.controlPoints = this.controlPoints.map((p) => {
      vec3.rotateY(p, p, [0, 0, 0], theta);
      return p;
    });

    const total = 50;
    this.points = [];
    for (let i = 0; i < total; i++) {
      const p = (i + 0.5) / total;
      const pos = bezier(this.controlPoints, p);
      this.points.push(pos);
    }

    setTimeout(() => {
      canSave = true;
    }, 500);
  }

  _initTextures() {}

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();

    this._drawRibbons = new DrawRibbons();
  }

  update() {}

  render() {
    let g = 0.1;
    GL.clear(g, g, g, 1);
    GL.setMatrices(this.camera);

    this._dAxis.draw();

    this.controlPoints.forEach((p) => {
      this._dBall.draw(p, [g, g, g], [1, 0, 0]);
    });

    g = 0.05;
    this.points.forEach((p) => {
      // this._dBall.draw(p, [g, g, g], [1, 1, 0]);
    });

    this._drawRibbons
      .uniform("uStart", this.controlPoints[0])
      .uniform("uCtrl0", this.controlPoints[1])
      .uniform("uCtrl1", this.controlPoints[2])
      .uniform("uEnd", this.controlPoints[3])
      .uniform("uTime", Scheduler.getElapsedTime())
      .draw();

    if (canSave && !hasSaved && Config.autoSave) {
      saveImage(GL.canvas, getDateString());
      hasSaved = true;
    }
  }

  resize() {}
}

export default SceneApp;
