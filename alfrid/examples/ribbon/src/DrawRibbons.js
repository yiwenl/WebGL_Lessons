import { Draw, Mesh } from "alfrid";

import { vec3 } from "gl-matrix";
import { random } from "./utils";

import vs from "shaders/ribbon.vert";
import fs from "shaders/ribbon.frag";

class DrawRibbons extends Draw {
  constructor() {
    super();

    const _vs = vs.replace("${NUM}", 5);

    const uvs = [];
    const indices = [];
    let count = 0;

    const numSegLength = 50;
    const numSegTube = 4;

    for (let j = 0; j < numSegTube; j++) {
      for (let i = 0; i < numSegLength; i++) {
        uvs.push([i / numSegLength, j / numSegTube]);
        uvs.push([(i + 1) / numSegLength, j / numSegTube]);
        uvs.push([(i + 1) / numSegLength, (j + 1) / numSegTube]);
        uvs.push([i / numSegLength, (j + 1) / numSegTube]);

        indices.push(count * 4 + 0);
        indices.push(count * 4 + 1);
        indices.push(count * 4 + 2);
        indices.push(count * 4 + 0);
        indices.push(count * 4 + 2);
        indices.push(count * 4 + 3);

        count++;
      }
    }

    const mesh = new Mesh().bufferTexCoord(uvs).bufferIndex(indices);

    // instancing
    let numInstance = 2000;
    const extras = [];
    while (numInstance--) {
      extras.push([random(), random(), random()]);
    }
    mesh.bufferInstance(extras, "aExtra");

    this.setMesh(mesh).useProgram(_vs, fs);
  }
}

export default DrawRibbons;
