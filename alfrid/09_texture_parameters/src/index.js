import { GL, Mesh, GLShader, GLTexture } from "alfrid";
import { pick, logError } from "./utils";
import { mat4 } from "gl-matrix";
import preload from "./preload";

// shaders
import vs from "shaders/basic.vert";
import fs from "shaders/texture.frag";

let texture;

// preload images
preload(["assets/img001.jpg", "assets/img002.jpg"]).then((imgs) => {
  console.log("Images loaded", imgs);
  texture = new GLTexture(imgs[0]);
  const wrappings = [
    GL.CLAMP_TO_EDGE, // default
    GL.MIRRORED,
    GL.MIRRORED_REPEAT,
  ];
  texture.wrapS = pick(wrappings);
  texture.wrapT = pick(wrappings);
  texture.minFilter = pick([GL.NEAREST, GL.LINEAR, GL.NEAREST_MIPMAP_LINEAR]);
  texture.magFilter = pick([GL.NEAREST, GL.LINEAR, GL.NEAREST_MIPMAP_LINEAR]);
}, logError);

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
GL.init(canvas);

// camera
const projMatrix = mat4.create();
const viewMatrix = mat4.create();
const modelMatrix = mat4.create();

// projection matrix ( camera perspective )
const { innerWidth, innerHeight } = window;
const fov = (90 * Math.PI) / 180;
const aspectRatio = innerWidth / innerHeight;
const near = 0.1;
const far = 1000;
mat4.perspective(projMatrix, fov, aspectRatio, near, far);
window.GL = GL;

// view matrix ( camera position / direction )
const radius = 0.5;
const updateCamera = (x = 0, y = 0) => {
  mat4.lookAt(viewMatrix, [x, y, radius], [0, 0, 0], [0, 1, 0]);
};
updateCamera();

// interaction
window.addEventListener("mousemove", ({ clientX, clientY }) => {
  const { innerWidth, innerHeight } = window;
  const range = 0.5;
  const x = ((clientX / innerWidth) * 2 - 1) * range;
  const y = ((1 - clientY / innerHeight) * 2 - 1) * range;

  // update camera
  updateCamera(x, y);
});

// setup vertices
const r = 0.5;
const points = [
  [-r, -r, 0],
  [r, -r, 0],
  [r, r, 0],
  [-r, r, 0],
];

// setup texture coordinates
const t = 0;
const uvs = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];

// setup indices, drawing 2 triangles
const indices = [0, 1, 2, 0, 2, 3];

// create mesh
const mesh = new Mesh()
  .bufferData(points, "aPosition")
  .bufferData(uvs, "aUV")
  .bufferIndex(indices);

// create shader
const shader = new GLShader(vs, fs);

// render
const render = () => {
  // clear
  GL.clear(0, 0, 0, 1);

  // wait for texture to load
  if (!texture) {
    window.requestAnimationFrame(render);
    return;
  }

  // bind shader
  shader.bind();
  shader
    .uniform("uProjMatrix", "mat4", projMatrix)
    .uniform("uViewMatrix", "mat4", viewMatrix)
    .uniform("uModMatrix", "mat4", modelMatrix)
    .uniform("uBrightness", "float", 0)
    .uniform("uMap", "int", 0); // for binding texture at position '0'

  texture.bind(0);

  // draw mesh
  GL.draw(mesh);

  // loop
  window.requestAnimationFrame(render);
};

// resize
const resize = () => {
  const { innerWidth, innerHeight } = window;
  GL.setSize(innerWidth, innerHeight);

  // update projection matrix
  mat4.perspective(projMatrix, fov, innerWidth / innerHeight, near, far);

  // refresh
  render();
};

resize();
window.addEventListener("resize", resize);

// render
render();
