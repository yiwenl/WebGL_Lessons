import {
  GL,
  Draw,
  Geom,
  ShaderLibs,
  DrawBall,
  DrawAxis,
  DrawCopy,
  FrameBuffer,
  Scene,
} from "alfrid";
import { targetWidth, targetHeight } from "./features";
import resize from "./utils/resize";
import { random, saveImage, getDateString } from "./utils";
import Config from "./Config";
import vs from "shaders/cubes.vert";
import fs from "shaders/cubes.frag";

import fsAA from "shaders/fxaa.frag";

let hasSaved = false;
let canSave = false;

class SceneApp extends Scene {
  constructor() {
    super();

    // resize(GL.canvas, targetWidth, targetHeight);

    // this.orbitalControl.lock();
    this.orbitalControl.rx.value = -0.4;
    this.orbitalControl.ry.value = -0.4;

    setTimeout(() => {
      canSave = true;
    }, 500);
  }

  _initTextures() {
    this.resize();

    const mul = 1;
    this._fbo = new FrameBuffer(GL.width * mul, GL.height * mul);
  }

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();

    // cubes
    const s = 1;
    const mesh = Geom.cube(s, s, s);

    const posOffset = [];
    const extra = [];
    let numCubes = 40;
    const r = 3;
    while (numCubes--) {
      posOffset.push([random(-r, r), random(-r, r), random(-r, r)]);
      extra.push([random(), random(), random()]);
    }
    mesh
      .bufferInstance(posOffset, "aPosOffset")
      .bufferInstance(extra, "aExtra");

    this._drawCubes = new Draw().setMesh(mesh).useProgram(vs, fs);

    this._drawAA = new Draw()
      .setMesh(Geom.bigTriangle())
      .useProgram(ShaderLibs.bigTriangleVert, fsAA);
  }

  update() {
    this._fbo.bind();
    GL.clear(0, 0, 0, 1);
    this._drawCubes.draw();
    this._fbo.unbind();
  }

  render() {
    let g = 0.1;
    GL.clear(g, g, g, 1);
    GL.setMatrices(this.camera);

    // this._dCopy.draw(this._fbo.texture);
    // this._drawCubes.draw();

    this._drawAA
      .bindTexture("texture", this._fbo.texture, 0)
      .uniform("uResolution", [1 / GL.width, 1 / GL.height])
      .draw();

    if (canSave && !hasSaved && Config.autoSave) {
      saveImage(GL.canvas, getDateString());
      hasSaved = true;
    }
  }

  resize() {
    const { innerWidth, innerHeight } = window;
    GL.setSize(innerWidth, innerHeight);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;
