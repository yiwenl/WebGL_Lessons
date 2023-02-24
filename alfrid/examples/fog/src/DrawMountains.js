import { Draw, Geom } from 'alfrid'

import { random } from './utils'
import vs from 'shaders/mountains.vert'
import fs from 'shaders/mountains.frag'

class DrawMountains extends Draw {
  constructor() {
    super();

    const s = 1
    const mesh = Geom.plane(s, s, 100, 'xz')

    const posOffsets = []
    const extras = []

    let num = 7;
    const r = 3
    while(num--) {
      posOffsets.push([random(-r, r), random(), random(-r, r)])
      extras.push([random(), random(), random()])
    }

    mesh
    .bufferInstance(posOffsets, 'aPosOffset')
    .bufferInstance(extras, 'aExtra')


    this.setMesh(mesh).useProgram(vs, fs)
  }
}

export default DrawMountains