export const loadImg = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => {
      resolve(img);
    });
    img.addEventListener("error", (e) => {
      reject(e);
    });

    img.src = src;
  });

const preload = (urls) =>
  new Promise((resolve, reject) => {
    const promises = urls.map((url) => loadImg(url));
    Promise.all(promises).then(
      (imgs) => {
        resolve(imgs);
      },
      (e) => reject(e)
    );
  });

export default preload;
