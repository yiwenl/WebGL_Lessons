import {
  GL,
  Draw,
  Geom,
  DrawBall,
  DrawAxis,
  DrawCopy,
  Scene,
  FrameBuffer,
} from "alfrid";
import resize from "./utils/resize";
import { saveImage, getDateString } from "./utils";
import Config from "./Config";

let hasSaved = false;
let canSave = false;

import vs from "shaders/basic.vert";
import fsDiffuse from "shaders/diffuse.frag";
import fsCopy from "shaders/copy.frag";

class SceneApp extends Scene {
  constructor() {
    super();

    this.resize();

    setTimeout(() => {
      canSave = true;
    }, 500);
  }

  _initTextures() {
    this._fbo = new FrameBuffer(window.innerWidth, window.innerHeight);
  }

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();

    const cube = Geom.cube(1, 1, 1);
    this._drawDiffuse = new Draw().setMesh(cube).useProgram(vs, fsDiffuse);
    this._drawCopy = new Draw().setMesh(cube).useProgram(vs, fsCopy);
  }

  update() {}

  render() {
    let g = 0.1;
    GL.clear(g, g, g, 1);
    GL.setMatrices(this.camera);

    this._dAxis.draw();
    this._fbo.bind();
    GL.clear(0, 0, 0, 1);
    this._drawDiffuse.draw();
    this._fbo.unbind();

    this._drawCopy.bindTexture("texture", this._fbo.texture, 0).draw();

    g = 400;
    GL.viewport(0, 0, g, g / GL.aspectRatio);
    this._dCopy.draw(this._fbo.texture);

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
