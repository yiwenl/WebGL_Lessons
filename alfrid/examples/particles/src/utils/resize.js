const _resize = (canvas, w, h, GL) => {
  const { innerWidth, innerHeight } = window;

  w = w || innerWidth;
  h = h || innerHeight;

  !!GL && GL.setSize(w, h);
  let tw = Math.min(w, innerWidth);
  let th = Math.min(h, innerHeight);

  const sx = innerWidth / w;
  const sy = innerHeight / h;
  const scale = Math.min(sx, sy);
  tw = w * scale;
  th = h * scale;
  const left = Math.floor(innerWidth - tw) / 2;
  const top = Math.floor(innerHeight - th) / 2;

  canvas.style.cssText = `
    position:absolute;
    width:${tw}px;
    height:${th}px;
    top:${top}px;
    left:${left}px;
  `;
};

const resize = (canvas, w, h, GL) => {
  window.addEventListener("resize", () => {
    _resize(canvas, w, h, GL);
  });
  _resize(canvas, w, h, GL);
};

export default resize;
