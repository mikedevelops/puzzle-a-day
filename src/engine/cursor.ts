import { DisplayObject } from "./objects/displayObject";
import { vec, Vec } from "./units/vec";
import { collision, debug, input } from "./global";
import { GameObject } from "./objects/gameObject";
import { DEBUG_COLLISION, GRID_UNIT } from "./settings";
import { Node } from "./grid";

export function createCursor(pos: Vec): Cursor {
  return new Cursor(0, pos, "marquee");
}

export interface SnapTo {
  snapTo(p: Vec): Node | null;
}

export class Cursor extends DisplayObject {
  private obj: GameObject | null = null;
  private pointerDown = false;

  public offset: Vec = vec(0, GRID_UNIT / 4);
  public snapParent: SnapTo | null = null;

  public getName(): string {
    return "CURSOR";
  }

  public update(): void {
    // if (this.snapParent) {
    //   const snapped = this.snapParent.snapTo(input.pointer.pos);
    //   if (snapped) {
    //     this.pos = snapped.world;
    //   }
    // } else {
    //   this.pos = input.pointer.pos.clone();
    // }

    const sortVecY = (objs: GameObject[]): GameObject[] => {
      return objs.sort((a, b) => {
        return a.pos.y - b.pos.y;
      });
    };

    /**
     * Get obj underneath pointer
     */
    const hits = sortVecY(collision.getObjAt(input.pointer.getWorldPos()));
    let hit = hits.pop() ?? null;

    if (hit !== this.obj) {
      this.obj?.onPointerOut();
    }

    this.obj = hit;
    this.obj?.onPointerOver();

    if (DEBUG_COLLISION) {
      debug.print(
        "COLLISION",
        this.obj ? `${this.obj?.id}_${this.obj?.getName()}` : "null"
      );
    }

    if (this.obj === null) {
      return;
    }

    // assume the position of the collision obj
    this.pos = this.obj.getWorldPos().clone();

    if (!this.pointerDown && input.isPointerDown()) {
      this.pointerDown = true;
      this.obj.onPointerDown();
    }

    if (this.pointerDown && !input.isPointerDown()) {
      this.pointerDown = false;
    }
  }

  public draw(): void {
    super.draw();
  }

  public debug(): void {
    let v = this.pos.toString();

    if (this.obj) {
      v += ` "${this.obj.getName()}" ${this.obj.pos.toString()}`;
    }

    debug.print("cursor", v);
  }
}
