import { State } from "../../../../src/engine/stateMachine";

export class GrassIdleState extends State {
  public static Name = "GRASS_IDLE";

  public enter(): void {}

  public leave(): void {}

  public update(delta: number): State | null {
    return null;
  }

  public getName(): string {
    return GrassIdleState.Name;
  }
}
