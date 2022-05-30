export type CTX = CanvasRenderingContext2D;

export interface Canvas {
  el: HTMLCanvasElement;
  ctx: CTX;
}

export function getCanvas(id: string = "stage"): Canvas {
  const c = document.getElementById(id) as HTMLCanvasElement;
  if (!c) {
    throw new Error(`Could not find #${id} element`);
  }
  const ctx = c.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get 2d context");
  }
  return { el: c, ctx };
}

export function createCanvas(width: number, height: number): Canvas {
  const cvs = document.createElement("canvas");
  const ctx = cvs.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get 2d context");
  }

  cvs.width = width;
  cvs.height = height;
  ctx.imageSmoothingEnabled = false;

  return { el: cvs, ctx };
}
