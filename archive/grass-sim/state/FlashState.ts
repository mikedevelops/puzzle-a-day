import { State } from "../../../src/engine/stateMachine";
import { DisplayObject } from "../../../src/engine/objects/displayObject";
import { Color } from "../../../src/engine/color";
import { FLASH_DURATION } from "../../../src/engine/settings";

export class FlashState extends State {
  public static Name = "FLASH";

  private delta = 0;

  constructor(
    private obj: DisplayObject,
    private prev: State,
    private done: () => void
  ) {
    super();
  }

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

  public getName(): string {
    return FlashState.Name;
  }
}
