import {
  GL,
  Geom,
  Draw,
  Mesh,
  FboPingPong,
  DrawBall,
  DrawAxis,
  DrawCopy,
  Scene,
} from "alfrid";
import resize from "./utils/resize";
import { random, saveImage, getDateString } from "./utils";
import Config from "./Config";
import Scheduler from "scheduling";

import vsSave from "shaders/save.vert";
import fsSave from "shaders/save.frag";

import vsRender from "shaders/render.vert";
import fsRender from "shaders/render.frag";

import vsPass from "shaders/pass.vert";
import fsSim from "shaders/sim.frag";

let hasSaved = false;
let canSave = false;

const numParticles = 64;

class SceneApp extends Scene {
  constructor() {
    super();

    // this.orbitalControl.lock();

    setTimeout(() => {
      canSave = true;
    }, 500);
  }

  _initTextures() {
    this.resize();
    //GL.FLOAT 32
    //GL.HALF_FLOAT 16

    // GL.LINEAR
    this._fbo = new FboPingPong(
      numParticles,
      numParticles,
      {
        type: GL.FLOAT,
        minFilter: GL.NEAREST,
        magFilter: GL.NEAREST,
      },
      3
    );
    this._fbo.all.forEach((fbo) => {
      fbo.bind();
      GL.clear(1, 0, 0, 1);
      fbo.unbind();
    });

    const positions = [];
    const extras = [];
    const uvs = [];
    const indices = [];
    let count = 0;

    const r = 2;
    for (let j = 0; j < numParticles; j++) {
      for (let i = 0; i < numParticles; i++) {
        // particle position
        positions.push([random(-r, r), random(-r, r), random(-r, r)]);

        // random data
        extras.push([random(), random(), random()]);

        // mesh point
        uvs.push([(i / numParticles) * 2 - 1, (j / numParticles) * 2 - 1]);

        indices.push(count);
        count++;
      }
    }

    const mesh = new Mesh(GL.POINTS)
      .bufferVertex(positions)
      .bufferData(extras, "aExtra")
      .bufferTexCoord(uvs)
      .bufferIndex(indices);

    this.drawSave = new Draw()
      .setMesh(mesh)
      .useProgram(vsSave, fsSave)
      .setClearColor(0, 0, 0, 0)
      .bindFrameBuffer(this._fbo.read)
      .draw();
  }

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();

    this._initDrawRender();
    this._initDrawSim();
  }

  _initDrawSim() {
    this._drawSim = new Draw()
      .setMesh(Geom.bigTriangle())
      .useProgram(vsPass, fsSim)
      .setClearColor(0, 0, 0, 1);
  }

  _initDrawRender() {
    const positions = [];
    const indices = [];
    let count = 0;

    for (let j = 0; j < numParticles; j++) {
      for (let i = 0; i < numParticles; i++) {
        positions.push([i / numParticles, j / numParticles, random()]);
        indices.push(count);
        count++;
      }
    }

    const mesh = new Mesh(GL.POINTS)
      .bufferVertex(positions)
      .bufferIndex(indices);

    this._drawParticles = new Draw()
      .setMesh(mesh)
      .useProgram(vsRender, fsRender);
  }

  update() {
    this._drawSim
      .bindFrameBuffer(this._fbo.write)
      .bindTexture("uPosMap", this._fbo.read.getTexture(0), 0)
      .bindTexture("uVelMap", this._fbo.read.getTexture(1), 1)
      .bindTexture("uExtraMap", this._fbo.read.getTexture(2), 2)
      .uniform("uTime", Scheduler.getElapsedTime())
      .draw();

    this._fbo.swap();
  }

  render() {
    let g = 0.1;
    GL.clear(g, g, g, 1);
    GL.setMatrices(this.camera);

    this._dAxis.draw();

    const r = 2;
    const c = [1, 0, 0];
    const s = [g, g, g];
    this._dBall.draw([-r, 0, 0], s, c);
    this._dBall.draw([r, 0, 0], s, c);
    this._dBall.draw([0, -r, 0], s, c);
    this._dBall.draw([0, r, 0], s, c);
    this._dBall.draw([0, 0, -r], s, c);
    this._dBall.draw([0, 0, r], s, c);

    this._drawParticles
      .bindTexture("uPosMap", this._fbo.read.getTexture(0), 0)
      .draw();

    g = 128;
    GL.viewport(0, 0, g, g);
    this._dCopy.draw(this._fbo.read.getTexture(0));
    GL.viewport(g, 0, g, g);
    this._dCopy.draw(this._fbo.read.getTexture(1));
    GL.viewport(g * 2, 0, g, g);
    this._dCopy.draw(this._fbo.read.getTexture(2));

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
