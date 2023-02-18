export function white(a = 1): string {
  return new Color(255, 255, 255, a).toString();
}

export function red(a = 1): string {
  return new Color(255, 0, 0, a).toString();
}

export function green(a = 1): string {
  return new Color(0, 255, 0, a).toString();
}

export function blue(a = 1): string {
  return new Color(0, 0, 255, a).toString();
}

export interface SerialisedColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export class Color {
  constructor(public r = 255, public g = 255, public b = 255, public a = 1) {}

  public static empty(): Color {
    return new Color(0, 0, 0, 0);
  }

  public static black(): Color {
    return new Color(0, 0, 0, 1);
  }

  public static red(a = 1): Color {
    return new Color(255, 0, 0, a);
  }

  public static green(a = 1): Color {
    return new Color(0, 255, 0, a);
  }

  public static blue(): Color {
    return new Color(0, 0, 255, 1);
  }

  public static white(a = 1): Color {
    return new Color(255, 255, 255, a);
  }

  public static magenta(a = 1): Color {
    return new Color(255, 0, 255, a);
  }

  public toString(): string {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`;
  }

  public equals(c: Color): boolean {
    return c.r === this.r && c.g === this.g && c.b === this.b && c.a === this.a;
  }

  public serialise(): SerialisedColor {
    return { r: this.r, g: this.g, b: this.b, a: this.a };
  }
}
