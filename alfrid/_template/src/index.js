import { GL } from "alfrid";
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
GL.init(canvas);

// resize
const resize = () => {
  const { innerWidth, innerHeight } = window;
  GL.setSize(innerWidth, innerHeight);
};

resize();
window.addEventListener("resize", resize);

// clear
GL.clear(0, 0, 0, 1);
