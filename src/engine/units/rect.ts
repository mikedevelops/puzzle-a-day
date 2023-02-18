import { Vec, vec } from "./vec";

export function rect(x: number, y: number, w: number, h: number): Rect {
  return new Rect(x, y, w, h);
}

export class Rect {
  public pos: Vec;
  public width: number;
  public height: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.pos = vec(x, y);
    this.width = w;
    this.height = h;
  }

  public contains(v: Vec): boolean {
    if (v.x < this.pos.x || v.x > this.pos.x + this.width) {
      return false;
    }

    if (v.y < this.pos.y || v.y > this.pos.y + this.height) {
      return false;
    }

    return true;
  }

  public multiply(n: number): Rect {
    return rect(
      this.pos.x * n,
      this.pos.y * n,
      this.width * n,
      this.height * n
    );
  }

  public addv(p: Vec): Rect {
    const n = this.pos.addv(p);
    return rect(n.x, n.y, this.width, this.height);
  }
}
