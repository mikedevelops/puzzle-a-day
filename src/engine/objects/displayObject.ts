import { vec, Vec } from "../units/vec";
import { renderer } from "../global";
import { Color } from "../color";
import { DEBUG_DISPLAY_OBJS } from "../settings";
import { GameObject } from "./gameObject";
import { StateMachine } from "../stateMachine";
import { DEBUG_LAYER } from "../renderer/renderer";

export abstract class DisplayObject extends GameObject {
  constructor(id: number, pos: Vec, stateMachine?: StateMachine) {
    super(id, pos, stateMachine);
  }

  public draw(): void {
    // for (const c of this.getChildrenRecursive()) {
    //   if (c instanceof DisplayObject && c.isEnabled()) {
    //     c.draw();
    // }
    // }
  }

  public debug(): void {
    super.debug();

    if (DEBUG_DISPLAY_OBJS) {
      const p = this.getWorldPos();
      renderer.fillRect(p, 8, 8, Color.green(), vec(), DEBUG_LAYER);
      renderer.fillText(
        this.getGrid().worldToLocalUnsafe(p).toString() + "\n" + p,
        p,
        Color.white(),
        1000,
        DEBUG_LAYER
      );
    }
  }
}
