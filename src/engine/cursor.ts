import { DisplayObject } from "./displayObject";
import { Vec } from "./vec";
import { collision, debug, input } from "../grass-sim/global";
import type { Level } from "../grass-sim/level";
import { DEBUG_COLLIDERS, DEBUG_CURSOR, DEBUG_GRASS } from "./settings";
import { Grass } from "../grass-sim/grass";

export function createCursor(pos: Vec): Cursor {
  return new Cursor(pos, "marquee");
}

export class Cursor extends DisplayObject {
  private obj: DisplayObject | null = null;
  public level: Level | null = null;
  private pointerDown = false;

  public update(): void {
    if (!this.level) {
      return;
    }

    const sortVecY = (dos: DisplayObject[]): DisplayObject[] => {
      return dos.sort((a, b) => {
        return a.pos.y - b.pos.y;
      });
    };

    /**
     * Get obj underneath cursor
     */
    const pointer = input.pointer.getScreenPos();
    const hits = sortVecY(collision.getObjAt(pointer));
    let hit = hits.pop() ?? null;

    if (DEBUG_COLLIDERS) {
      debug.print(
        "collision",
        `${pointer.toString()} ${hit ? hit.getName() : "null"}`
      );
    }

    if (hit instanceof Grass) {
      hit = hit.getTopOfStack();
    }

    if (hit !== this.obj) {
      this.obj?.onPointerOut();
    }

    this.obj = hit;

    if (!this.obj) {
      return;
    }

    this.obj.onPointerOver();

    if (!this.pointerDown && input.isPointerDown()) {
      this.pointerDown = true;
      this.obj.onPointerDown();
    }

    if (this.pointerDown && !input.isPointerDown()) {
      this.pointerDown = false;
    }
  }

  public debug(): void {
    if (!DEBUG_CURSOR) {
      return;
    }

    let v = this.pos.toString();

    if (this.obj) {
      v += ` "${this.obj.sprite}" ${this.obj.pos.toString()}`;
    }

    debug.print("cursor", v);
  }
}
