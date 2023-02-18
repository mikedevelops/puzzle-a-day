import { Grid } from "../../../src/engine/grid";
import { vec, Vec } from "../../engine/vec";
import { Cursor } from "../../../src/engine/cursor";
import { GameObject } from "../../../src/engine/objects/gameObject";
import { DisplayObject } from "../../../src/engine/objects/displayObject";

export function createLevel(
  width: number,
  height: number,
  size: number,
  pos = vec()
): Level {
  return new Level(width, height, pos, size);
}

export class Level extends Grid {
  constructor(width: number, height: number, pos: Vec, size: number) {
    const node = (local: Vec, world: Vec) => ({ local, world });
    super(width, height, pos, size, node);
  }

  public fillGrid(factory: () => GameObject): void {
    this.forEach((node) => {
      const obj = factory();
      this.addToGrid(obj, node.local);
    });
  }

  public addToGrid(obj: GameObject, p: Vec): void {
    const gp = this.vecToWorld(p);
    this.add(obj, gp);
  }

  public debug(): void {
    super.debug();
    const children = this.getChildrenRecursive();
    for (const c of children) {
      c.debug();
    }
  }

  public draw(): void {
    const children = this.getChildrenRecursive();
    for (const c of children) {
      if (c instanceof DisplayObject) {
        c.draw();
      }
    }
  }
}
