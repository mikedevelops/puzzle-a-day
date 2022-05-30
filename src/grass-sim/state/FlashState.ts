import { State } from "../../engine/stateMachine";
import { DisplayObject } from "../../engine/displayObject";
import { Color } from "../../engine/color";
import { FLASH_DURATION } from "../../engine/settings";

export class FlashState implements State {
  public readonly name = "FLASH";
  private delta = 0;

  constructor(
    private obj: DisplayObject,
    private prev: State,
    private done: () => void
  ) {}

  public enter(): void {
    this.obj.tint = Color.white();
  }

  public leave(): void {
    this.obj.tint = Color.empty();
    this.done();
  }

  public update(delta: number): State | null {
    this.delta += delta;
    if (this.delta < FLASH_DURATION) {
      return null;
    }
    return this.prev;
  }
}
