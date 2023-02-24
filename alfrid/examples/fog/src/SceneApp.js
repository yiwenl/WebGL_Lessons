import { GL, Draw, Geom, DrawCamera, DrawLine, DrawBall, DrawAxis, DrawCopy, Scene, CameraPerspective, FrameBuffer } from "alfrid";
import { random, saveImage, getDateString } from "./utils";
import Config from "./Config";
import Scheduler from 'scheduling'
import DrawMountains from "./DrawMountains";
import { mat4 } from 'gl-matrix'

import vs from 'shaders/fog.vert'
import fs from 'shaders/fog.frag'

let hasSaved = false;
let canSave = false;

class SceneApp extends Scene {
  constructor() {
    super();

    // this.orbitalControl.lock();
    this.orbitalControl.rx.value = 0.3;
    this.orbitalControl.ry.value = 0.3;

    this.cameraLight = new CameraPerspective()

    const RAD = Math.PI / 180
    this.cameraLight.setPerspective(60 * RAD, 1, 2, 8)
    this.cameraLight.lookAt([5, 1, 0], [0, 0, 0])

    this.mtxShadow = mat4.create();
    mat4.mul(this.mtxShadow, this.cameraLight.projection, this.cameraLight.view)

    this.pointA = [2, 1, 0]
    this.pointB = [-2, -1, 0]


    this.updateShadowMap()

    this.resize();
  }

  updateShadowMap() {
    this._fboShadow.bind()
    GL.clear(0, 0, 0, 1)
    GL.setMatrices(this.cameraLight)
    this._drawMountains.draw();    
    this._fboShadow.unbind();
  }

  _initTextures() {
    const fboSize = 1024
    this._fboShadow = new FrameBuffer(fboSize, fboSize)
  }

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();
    this._dLine = new DrawLine()
    this._dCamera = new DrawCamera()
    this._drawMountains = new DrawMountains()

    const s = 4
    const mesh = Geom.plane(s, s, 1)

    const total = 100
    const posOffset = []
    for(let i=0; i<total; i++) {
      const z = -s/2 + (i + 0.5)/total * s
      posOffset.push([0, 0, z])
    }
    mesh.bufferInstance(posOffset, 'aPosOffset')
    

    this._drawPlane = new Draw()
    .setMesh(mesh)
    .useProgram(vs, fs)
    .uniform('uTotal', total)
    .uniform('uSeed', random())
  }

  update() {}

  render() {
    let g = .1;
    GL.clear(g, g, g, 1);
    GL.setMatrices(this.camera);

    this._dAxis.draw();
    this._dLine.draw(this.pointA, this.pointB, [1, 1, 0])
    this._dCamera.draw(this.cameraLight)

    this._drawMountains.draw();
    this._drawPlane
    .uniform('uTime', Scheduler.getElapsedTime())
    .uniform('uPointA', this.pointA)
    .uniform('uPointB', this.pointB)
    .uniform('uShadowMatrix', this.mtxShadow)
    .bindTexture('uDepthMap', this._fboShadow.depthTexture, 0)
    .draw();

    // g = 300
    // GL.viewport(0, 0, g, g)
    // this._dCopy.draw(this._fboShadow.texture)
    // GL.viewport(g, 0, g, g)
    // this._dCopy.draw(this._fboShadow.depthTexture)

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
