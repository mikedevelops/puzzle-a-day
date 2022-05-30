import { State } from "../../engine/stateMachine";

export class IdleState implements State {
  public readonly name = "IDLE";

  public enter(): void {}

  public leave(): void {}

  public update(delta: number): State | null {
    return null;
  }
}
