import "./Capture";
import resize from "./resize";

const setupProject = (width, height) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.id = "main-canvas";
  document.body.appendChild(canvas);

  resize(canvas, width, height);

  const ctx = canvas.getContext("2d");
  return { canvas, ctx, width, height };
};

export default setupProject;
