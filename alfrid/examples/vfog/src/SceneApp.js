import { GL,Draw, Geom, DrawLine, DrawBall, DrawAxis, DrawCopy, Scene } from "alfrid";
import { random, saveImage, getDateString } from "./utils";
import Config from "./Config";

import vs from 'shaders/fog.vert'
import fs from 'shaders/fog.frag'

let hasSaved = false;
let canSave = false;

class SceneApp extends Scene {
  constructor() {
    super();

    // this.orbitalControl.lock();
    this.orbitalControl.rx.value = .3
    this.orbitalControl.ry.value = .3

    this.pointA = [3, 0.5, 0]
    this.pointB = [-3, -0.5, 0]

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
    this._dLine = new DrawLine()

    const s = 4;
    const mesh = Geom.plane(s ,s , 1)

    const total = 50
    const posOffsets = []
    for(let i =0; i<total; i++) {
      const z = -s/2 + (i + 0.5) / total * s;
      posOffsets.push([0, 0, z])
    }
    mesh.bufferInstance(posOffsets, 'aPosOffset')

    this._drawPlane = new Draw()
    .setMesh(mesh)
    .useProgram(vs, fs)
    .uniform('uTotal', total)
    .uniform('uSeed', random())
  }

  update() {}

  render() {
    let g = 0.1;
    GL.clear(g, g, g, 1);
    GL.setMatrices(this.camera);

    this._dAxis.draw();
    this._dLine.draw(this.pointA, this.pointB, [1, 1, 0])
    
    this._drawPlane
    .uniform('uPointA', this.pointA)
    .uniform('uPointB', this.pointB)
    .draw();

    if (canSave && !hasSaved && Config.autoSave) {
      saveImage(GL.canvas, getDateString());
      hasSaved = true;
    }
  }

  resize() {
    const { innerWidth: w, innerHeight: h, devicePixelRatio } = window;
    GL.setSize(w, h)
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;
