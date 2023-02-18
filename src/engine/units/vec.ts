export function vec(x = 0, y = 0): Vec {
  return new Vec(x, y);
}

export enum Direction {
  North,
  East,
  South,
  West,
}

export class Vec {
  constructor(public x = 0, public y = 0) {}

  public static from({ x, y }: { x: number; y: number }): Vec {
    return vec(x, y);
  }

  public static north(): Vec {
    return vec(0, -1);
  }

  public static east(): Vec {
    return vec(1, 0);
  }

  public static south(): Vec {
    return vec(0, 1);
  }

  public static west(): Vec {
    return vec(-1, 0);
  }

  public toString(fixed = 0): string {
    return `{ ${this.x.toFixed(fixed)},${this.y.toFixed(fixed)} }`;
  }

  public equalsv(v: Vec): boolean {
    return this.equals(v.x, v.y);
  }

  public equals(x: number, y: number): boolean {
    return this.x === x && this.y === y;
  }

  public add(x: number, y = x): Vec {
    return vec(this.x + x, this.y + y);
  }

  public addv(v: Vec): Vec {
    return vec(this.x + v.x, this.y + v.y);
  }

  public clone(): Vec {
    return vec(this.x, this.y);
  }

  public sub(x: number, y = x): Vec {
    return vec(this.x - x, this.y - y);
  }

  public subv(v: Vec): Vec {
    return vec(this.x - v.x, this.y - v.y);
  }

  public divide(x: number, y = x): Vec {
    const sx = x === 0 ? 0 : this.x / x;
    const sy = y === 0 ? 0 : this.y / y;

    return vec(sx, sy);
  }

  public multiply(x: number, y = x): Vec {
    return vec(this.x * x, this.y * y);
  }

  public round(): Vec {
    return vec(Math.round(this.x), Math.round(this.y));
  }

  public mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public normalize(): Vec {
    return this.divide(this.mag());
  }

  public distance(p: Vec): number {
    return Math.abs(
      Math.sqrt(
        (this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y)
      )
    );
  }

  public dir(dest: Vec): Vec {
    return dest.subv(this).normalize().round();
  }

  public static lerp(start: Vec, end: Vec, progress: number): Vec {
    const axis = (s: number, e: number) => (1 - progress) * s + progress * e;
    return vec(axis(start.x, end.x), axis(start.y, end.y));
  }

  public static deserialiseDirection(dir: Vec): Direction {
    if (dir.equalsv(Vec.north())) {
      return Direction.North;
    }
    if (dir.equalsv(Vec.east())) {
      return Direction.East;
    }
    if (dir.equalsv(Vec.south())) {
      return Direction.South;
    }
    if (dir.equalsv(Vec.west())) {
      return Direction.West;
    }

    throw new Error("unable to deserialise direction: " + dir.toString());
  }
}
