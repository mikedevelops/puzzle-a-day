import { vec, Vec } from "./vec";

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export function randVec(min: Vec, max: Vec): Vec {
  return vec(randInt(min.x, max.x), randInt(min.y, max.y));
}

export function randRange(n: number, v: number): number {
  const variance = (n * v) / 2;
  const r = randInt(n - variance, n + variance);
  return r;
}

export function delta(n: number, done: () => void): (d: number) => void {
  let t = 0;
  return (d: number) => {
    t += d;
    if (t < n) return;
    t = 0;
    done();
  };
}

export function clamp(n: number, min: number, max: number): number {
  return n < min ? min : n > max ? max : n;
}
