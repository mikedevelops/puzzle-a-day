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

export class Color {
  constructor(public r = 255, public g = 255, public b = 255, public a = 1) {}

  public static empty(): Color {
    return new Color(0, 0, 0, 0);
  }

  public static black(): Color {
    return new Color(0, 0, 0, 1);
  }

  public static red(): Color {
    return new Color(255, 0, 0, 1);
  }

  public static green(): Color {
    return new Color(0, 255, 0, 1);
  }

  public static blue(): Color {
    return new Color(0, 0, 255, 1);
  }

  public static white(): Color {
    return new Color(255, 255, 255, 1);
  }

  public static magenta(): Color {
    return new Color(255, 0, 255, 1);
  }

  public toString(): string {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`;
  }

  public equals(c: Color): boolean {
    return c.r === this.r && c.g === this.g && c.b === this.b && c.a === this.a;
  }
}
