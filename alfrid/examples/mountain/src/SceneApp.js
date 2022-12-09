import {
  GL,
  Draw,
  Geom,
  FrameBuffer,
  ShaderLibs,
  DrawBall,
  DrawAxis,
  DrawCopy,
  Scene,
} from "alfrid";
import resize from "./utils/resize";
import { random, saveImage, getDateString } from "./utils";
import Config from "./Config";
import Scheduler from "scheduling";

import fsHeight from "shaders/height.frag";
import vsMountain from "shaders/mountain.vert";
import fsMountain from "shaders/mountain.frag";

let hasSaved = false;
let canSave = false;

class SceneApp extends Scene {
  constructor() {
    super();

    // this.orbitalControl.lock();
    this.orbitalControl.rx.value = 0.5;
    this.orbitalControl.ry.value = 0.5;
    this.time = random();
    this.resize();

    setTimeout(() => {
      canSave = true;
    }, 500);
  }

  _initTextures() {
    const fboSize = 1024;
    this._fbo = new FrameBuffer(fboSize, fboSize);
  }

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();

    this._drawHeight = new Draw()
      .setMesh(Geom.bigTriangle())
      .useProgram(ShaderLibs.bigTriangleVert, fsHeight)
      .uniform("uSeed", random());

    const s = 3;
    const w = 0.05;
    const num = s / w;
    const mesh = Geom.plane(s, w * 0.5, 200, "xz");
    const positions = [];

    for (let i = 0; i < num; i++) {
      let z = i * w - s / 2;
      positions.push([random(), random(), z]);
    }
    mesh.bufferInstance(positions, "aPosOffset");

    this._drawMountain = new Draw()
      .setMesh(mesh)
      .useProgram(vsMountain, fsMountain)
      .uniform("uSize", s / 2);
  }

  update() {
    // this.time += 0.01;
    this._fbo.bind();

    GL.clear(0, 0, 0, 1);
    this._drawHeight.uniform("uTime", this.time).draw();
    this._fbo.unbind();
  }

  render() {
    let g = 0.1;
    GL.clear(g, g, g, 1);
    GL.setMatrices(this.camera);

    this._dAxis.draw();
    this._drawMountain.bindTexture("uHeightMap", this._fbo.texture, 0).draw();

    g = 300;
    GL.viewport(0, 0, g, g);
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
    s = 2;
    const width = w;
    const height = h;
    GL.setSize(w, h);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;
