var parseOBJ = require('geom-parse-obj')

var formAttributes = ({ cells, positions, normals, uvs }) => {
  let count = 0
  var _positions = []
  var _normals = []
  var _uvs = []
  cells.forEach((cell, i) => {
    cell.forEach(index => {
      _positions.push(positions[index])
      _uvs.push(uvs[index])
      if (normals) {
        _normals.push(normals[index])
      }
    })
    count += 3
  })

  return {
    positions: _positions,
    normals: _normals,
    uvs: _uvs,
    count
  }
}

var loadObj = (mFileName, mCallback) => {
  var oReq = new XMLHttpRequest()
  oReq.addEventListener('load', () => {
    var o = parseOBJ(oReq.response)

    var attribtues = formAttributes(o)

    mCallback(attribtues)
  })

  oReq.open('GET', `${mFileName}`)

  oReq.send()
}

module.exports = loadObj
