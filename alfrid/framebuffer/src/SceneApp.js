import {
  GL,
  FrameBuffer,
  Draw,
  Geom,
  ShaderLibs,
  DrawBall,
  DrawAxis,
  DrawCopy,
  Scene,
} from "alfrid";
import resize from "./utils/resize";
import { saveImage, getDateString } from "./utils";
import Config from "./Config";

let hasSaved = false;
let canSave = false;

import vs from "shaders/basic.vert";
import vsPass from "shaders/pass.vert";
import fsDiffuse from "shaders/diffuse.frag";
import fsCopy from "shaders/copy.frag";
import fsBlur from "shaders/blur.frag";

import fsCompose from "shaders/compose.frag";

class SceneApp extends Scene {
  constructor() {
    super();

    // this.orbitalControl.lock();

    this.resize();

    setTimeout(() => {
      canSave = true;
    }, 500);
  }

  _initTextures() {
    this._fbo = new FrameBuffer(window.innerWidth, window.innerHeight);
    this._fboBlur = new FrameBuffer(window.innerWidth, window.innerHeight);
    this._fboBlurFinal = new FrameBuffer(window.innerWidth, window.innerHeight);
  }

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();

    const cube = Geom.cube(1, 1, 1);
    this._drawCube = new Draw().setMesh(cube).useProgram(vs, fsDiffuse);
    this._drawCubeImage = new Draw().setMesh(cube).useProgram(vs, fsCopy);

    this._drawBlur = new Draw()
      .setMesh(Geom.bigTriangle())
      .useProgram(ShaderLibs.bigTriangleVert, fsBlur);

    this._drawCompose = new Draw()
      .setMesh(Geom.bigTriangle())
      .useProgram(ShaderLibs.bigTriangleVert, fsCompose);
  }

  update() {}

  render() {
    let g = 0.1;
    GL.clear(g, g, g, 1);
    GL.setMatrices(this.camera);

    this._fbo.bind();
    GL.clear(0, 0, 0, 1);
    this._drawCube.draw();
    this._fbo.unbind();

    this._fboBlur.bind();
    GL.clear(0, 0, 0, 1);
    this._drawBlur
      .bindTexture("texture", this._fbo.texture, 0)
      .uniform("uDir", [1, 0])
      .draw();
    this._fboBlur.unbind();

    this._fboBlurFinal.bind();
    GL.clear(0, 0, 0, 1);
    this._drawBlur
      .bindTexture("texture", this._fboBlur.texture, 0)
      .uniform("uDir", [0, 1])
      .draw();
    this._fboBlurFinal.unbind();
    // this._dCopy.draw(this._fboBlur.texture);

    this._drawCompose
      .bindTexture("uMap", this._fbo.texture, 0)
      .bindTexture("uBlurMap", this._fboBlur.texture, 1)
      .draw();

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
