import { GL, Mesh, Draw, DrawBall, DrawAxis, DrawCopy, Scene } from "alfrid";
import resize from "./utils/resize";
import { saveImage, getDateString, random } from "./utils";
import Config from "./Config";

import vs from "shaders/lines.vert";
import fs from "shaders/lines.frag";

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
    const indices = [];
    let index = 0;

    const r = 2;
    let num = 100;
    while (num--) {
      positions.push([random(-r, r), random(-r, r), random(-r, r)]);
      positions.push([random(-r, r), random(-r, r), random(-r, r)]);

      indices.push(index * 2);
      indices.push(index * 2 + 1);

      index++;
    }

    const mesh = new Mesh(GL.LINES)
      .bufferVertex(positions)
      .bufferIndex(indices);

    this._drawLines = new Draw().setMesh(mesh).useProgram(vs, fs);
  }

  update() {}

  render() {
    let g = 0.1;
    GL.clear(g, g, g, 1);
    GL.setMatrices(this.camera);

    this._dAxis.draw();
    this._drawLines.draw();

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
    GL.setSize(w, h);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;
