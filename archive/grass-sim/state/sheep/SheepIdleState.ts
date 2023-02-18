import { State } from "../../../../src/engine/stateMachine";

export class SheepIdleState extends State {
  public static Name = "SHEEP_IDLE";

  public enter(): void {}

  public leave(): void {}

  public update(delta: number): State | null {
    return null;
  }

  public getName(): string {
    return SheepIdleState.Name;
  }
}
