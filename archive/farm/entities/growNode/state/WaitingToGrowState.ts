import { State } from "../../../../../src/engine/stateMachine";
import { GrowNode } from "../GrowNode";
import { economy } from "../../../global";
import { GrowState } from "./GrowState";

export class WaitingToGrowState extends State {
  constructor(private node: GrowNode) {
    super();
  }

  public enter(): void {
    this.node.reset();
  }

  public leave(): void {}

  public getName(): string {
    return "WAITING_TO_GROW";
  }

  public update(delta: number): State | null {
    if (this.maybeGrow()) {
      return new GrowState(this.node);
    }

    return null;
  }

  private maybeGrow(): boolean {
    return economy.buy(this.node.getType(), this.node.getCost(), 1);
  }
}
