import {
  GL,
  Draw,
  Geom,
  DrawBall,
  DrawAxis,
  DrawCopy,
  Scene,
  FrameBuffer,
  ShaderLibs,
} from "alfrid";
import { random, saveImage, getDateString } from "./utils";
import Config from "./Config";

let hasSaved = false;
let canSave = false;

import vs from "shaders/basic.vert";
import fs from "shaders/diffuse.frag";

import vsAA from "shaders/fxaa.vert";
import fsAA from "shaders/fxaa.frag";

class SceneApp extends Scene {
  constructor() {
    super();

    this.resize();
    // this.orbitalControl.lock();
    this.orbitalControl.rx.value = -0.4;
    this.orbitalControl.ry.value = -0.4;

    setTimeout(() => {
      canSave = true;
    }, 500);
  }

  _initTextures() {
    const { innerWidth, innerHeight } = window;
    const scale = 2;
    this._fbo = new FrameBuffer(innerWidth * scale, innerHeight * scale);
  }

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();

    const s = 2;
    const mesh = Geom.cube(s, s, s);

    let numInstance = 200;
    const posOffsets = [];
    const extras = [];
    const r = 4;
    while (numInstance--) {
      posOffsets.push([random(-r, r), random(-r, r), random(-r, r)]);
      extras.push([random(), random(), random()]);
    }

    mesh
      .bufferInstance(posOffsets, "aPosOffset")
      .bufferInstance(extras, "aExtra");

    this._drawCube = new Draw()
      .setMesh(mesh)
      .useProgram(vs, fs)
      .bindFrameBuffer(this._fbo)
      .setClearColor(0, 0, 0, 1);

    this._drawAA = new Draw()
      .setMesh(Geom.bigTriangle())
      .useProgram(ShaderLibs.bigTriangleVert, fsAA);
  }

  update() {}

  render() {
    let g = 0.1;
    GL.clear(g, g, g, 1);
    GL.setMatrices(this.camera);

    this._drawCube.draw();
    // this._dCopy.draw(this._fbo.texture);
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
