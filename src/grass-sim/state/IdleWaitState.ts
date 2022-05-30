import { State } from "../../engine/stateMachine";
import { Sheep } from "../sheep";

export const S_IDLE_WAIT = "IDLE_WAIT";

export class IdleWaitState implements State {
  private waitDelta = 0;
  public readonly name = S_IDLE_WAIT;

  constructor(private sheep: Sheep, private waitFor: number) {}

  public enter(): void {}

  public leave(): void {}

  public update(delta: number): State | null {
    this.waitDelta += delta;
    if (this.waitDelta < this.waitFor) {
      return null;
    }
    return this.sheep.getNextState();
  }
}
