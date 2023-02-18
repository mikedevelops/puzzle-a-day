import { State } from "../../../../src/engine/stateMachine";
import { Sheep } from "../../sheep";

export class SheepIdleWaitState extends State {
  public static Name = "SHEEP_IDLE_WAIT";

  private waitDelta = 0;

  constructor(private sheep: Sheep, private waitFor: number) {
    super();
  }

  public enter(): void {}

  public leave(): void {}

  public update(delta: number): State | null {
    this.waitDelta += delta;
    if (this.waitDelta < this.waitFor) {
      return null;
    }
    return this.sheep.getNextState();
  }

  public getName(): string {
    return SheepIdleWaitState.Name;
  }
}
