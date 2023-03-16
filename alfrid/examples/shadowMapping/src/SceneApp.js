import {
  GL,
  Geom,
  Draw,
  FrameBuffer,
  CameraPerspective,
  CameraOrtho,
  DrawBall,
  DrawAxis,
  DrawCopy,
  DrawCamera,
  Scene,
} from "alfrid";
import { saveImage, getDateString } from "./utils";
import Config from "./Config";
import { mat4 } from "gl-matrix";

import vs from "shaders/basic.vert";
import fs from "shaders/diffuse.frag";
import fsFloor from "shaders/floor.frag";

let hasSaved = false;
let canSave = false;

class SceneApp extends Scene {
  constructor() {
    super();
    this.resize();

    // this.orbitalControl.lock();
    this.orbitalControl.rx.value = 0.3;
    this.orbitalControl.ry.value = 0.3;

    this.mtxFloor = mat4.create();
    mat4.translate(this.mtxFloor, this.mtxFloor, [0, -1, 0]);

    const RAD = Math.PI / 180;
    this.lightPos = [2, 2, 2];
    this.cameraLight = new CameraPerspective();
    this.cameraLight.setPerspective(90 * RAD, 1, 2, 10);

    // const r = 2;
    // this.cameraLight = new CameraOrtho();
    // this.cameraLight.ortho(-r, r, r, -r, 2, 10);

    this.cameraLight.lookAt(this.lightPos, [0, 0, 0]);

    this.mtxShadow = mat4.create();
    mat4.mul(
      this.mtxShadow,
      this.cameraLight.projectionMatrix,
      this.cameraLight.viewMatrix
    );

    this._generateShadowMap();

    setTimeout(() => {
      canSave = true;
    }, 500);
  }

  _generateShadowMap() {
    this.fboShadow.bind();
    GL.clear(0, 0, 0, 0);

    GL.setMatrices(this.cameraLight);
    this._drawCube.draw();

    this.fboShadow.unbind();
  }

  _initTextures() {
    const fboSize = 1024 * 1;
    this.fboShadow = new FrameBuffer(fboSize, fboSize);
  }

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();
    this._dCamera = new DrawCamera();

    let s = 1;
    this._drawCube = new Draw().setMesh(Geom.cube(s, s, s)).useProgram(vs, fs);

    s = 8;
    this._drawFloor = new Draw()
      .setMesh(Geom.plane(s, s, 1, "xz"))
      .useProgram(vs, fsFloor);
  }

  update() {}

  render() {
    let g = 0.1;
    GL.clear(g, g, g, 1);
    GL.setMatrices(this.camera);

    this._dAxis.draw();
    this._dCamera.draw(this.cameraLight);
    this._dBall.draw(this.lightPos, [g, g, g], [1, 1, 0]);
    this._drawCube.draw();

    GL.setModelMatrix(this.mtxFloor);
    this._drawFloor
      .uniform("uShadowMatrix", this.mtxShadow)
      .bindTexture("uDepthMap", this.fboShadow.depthTexture, 0)
      .draw();

    g = 400;
    GL.viewport(0, 0, g, g);
    this._dCopy.draw(this.fboShadow.depthTexture);

    if (canSave && !hasSaved && Config.autoSave) {
      saveImage(GL.canvas, getDateString());
      hasSaved = true;
    }
  }

  resize() {
    const { innerWidth: w, innerHeight: h, devicePixelRatio } = window;
    GL.setSize(w, h);
    // resize(GL.canvas, width * s, height * s, GL);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;
