import { rgb } from "./utils";
import setupProject from "./utils/setupProject2D";

import Settings from "./Settings";
import addControls from "./utils/addControl";

// development
if (process.env.NODE_ENV === "development") {
  Settings.init();
  addControls();
}

const pixelRatio = 2;
const targetWidth = 1080 * pixelRatio;
const targetHeight = 1350 * pixelRatio;
const { ctx, width, height } = setupProject(targetWidth, targetHeight);

ctx.fillStyle = rgb(255, 255, 245);
ctx.fillRect(0, 0, width, height);
