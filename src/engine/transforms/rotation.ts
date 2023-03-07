export function createRotation(
  start: number,
  end: number,
  duration: number
): Rotation {
  return new Rotation(start, end, duration);
}

export class Rotation {
  private complete = false;
  private value = this.start;

  constructor(
    private start: number,
    private end: number,
    private duration: number
  ) {}

  public update(delta: number): number {
    if (this.complete) {
      return this.end;
    }

    this.value = this.end;
    this.complete = true;

    return this.value;
  }
}
