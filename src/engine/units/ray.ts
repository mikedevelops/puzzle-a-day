import { Vec } from "./vec";

/**
 * Rays are defined in screen space. The
 * camera offset should be applied to
 * the start & end values.
 */

export function createRay(start: Vec, end: Vec): Ray {
  return new Ray(start, end);
}

export class Ray {
  private readonly distance: number;
  constructor(public start: Vec, public end: Vec, private step = 10) {
    this.distance = start.distance(end);
  }

  public getPoints(): Vec[] {
    const p: Vec[] = [];
    const dir = this.end.subv(this.start).normalize();
    let tmp = this.start;

    while (this.start.distance(tmp) < this.distance) {
      p.push(tmp);
      tmp = tmp.addv(dir.multiply(this.step));
    }

    return p;
  }
}
