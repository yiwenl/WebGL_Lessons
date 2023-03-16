import { vec3 } from "gl-matrix";
const bezier = (mPoints, t) => {
  if (mPoints.length === 2) {
    const p = vec3.create();
    vec3.lerp(p, mPoints[0], mPoints[1], t);
    return p;
  }

  const a = [];
  for (let i = 0; i < mPoints.length - 1; i++) {
    const p = vec3.create();
    vec3.lerp(p, mPoints[i], mPoints[i + 1], t);
    a.push(p);
  }
  return bezier(a, t);
};

export default bezier;
