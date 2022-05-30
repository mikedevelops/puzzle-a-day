import { Color } from "./color";
import { CTX } from "./canvas";
import { Vec } from "./vec";

const tintCache = new Map<CTX, Record<string, ImageData>>();

// TODO: this does not combine the src image with the tint, it replaces the src image pixels with the tint color
export function tint(pos: Vec, src: CTX, color: Color): HTMLCanvasElement {
  if (color.equals(Color.empty())) {
    return src.canvas;
  }

  const key = () => `${pos.toString()},${color.toString()}`;
  const cache = tintCache.get(src);

  // TODO: make cache work

  // if (cache && cache[key()]) {
  //   src.putImageData(cache[key()], 0, 0);
  //   return src.canvas;
  // }

  const { width, height } = src.canvas;
  const { data } = src.getImageData(0, 0, width, height);

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];

    if (a !== 0) {
      data[i] = color.r;
      data[i + 1] = color.b;
      data[i + 2] = color.g;
    }
  }

  const tintData = new ImageData(data, width, height);
  const cvs = src.canvas.cloneNode() as HTMLCanvasElement;
  const ctx = cvs.getContext("2d")!; // TODO: lazy

  // tintCache.set(src, {
  //   [key()]: tintData,
  // });

  ctx.putImageData(tintData, 0, 0);

  return cvs;
}
