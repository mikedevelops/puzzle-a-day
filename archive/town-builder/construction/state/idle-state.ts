import { State } from "../../../../src/engine/stateMachine";
import { IDLE_STATE } from "./state";

export class IdleState extends State {
  public enter(): void {}

  public getName(): string {
    return IDLE_STATE;
  }

  public leave(): void {}

  public update(delta: number): State | null {
    return null;
  }
}
