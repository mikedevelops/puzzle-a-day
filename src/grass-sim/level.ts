import { Grid } from "../engine/grid";
import { vec, Vec } from "../engine/vec";
import { Layer } from "./layer";
import { DisplayObjectFactory } from "../engine/displayObject";
import { Cursor } from "../engine/cursor";
import { GROW_RATE } from "../engine/settings";
import { delta, randInt } from "../engine/maths";

export function createLevel(
  width: number,
  height: number,
  size: number,
  pos = vec()
): Level {
  return new Level(width, height, pos, size);
}

export class Level extends Grid {
  public layers: Layer[] = [];
  public cursor: Cursor | null = null;

  constructor(width: number, height: number, pos: Vec, size: number) {
    super(width, height, pos, size);
  }

  public addLayer(l: Layer): void {
    if (this.layers[l.index]) {
      throw new Error(`Cannot create 2 layers at ${l.index}`);
    }

    this.layers[l.index] = l;
  }

  public debug(): void {
    super.debug();

    for (const layer of this.layers) {
      layer.debug();
    }

    this.cursor?.debug();
  }

  public update(delta: number): void {
    for (const layer of this.layers) {
      layer.update(delta);
    }

    this.cursor?.update();
  }

  public draw(): void {
    for (const layer of this.layers) {
      layer.draw();
    }

    this.cursor?.draw();
  }

  public addCursor(c: Cursor): void {
    this.cursor = c;
    c.level = this;
  }
}
