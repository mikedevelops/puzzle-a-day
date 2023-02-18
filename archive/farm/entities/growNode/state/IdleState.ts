import { GameObject, Handler } from "../../../../../src/engine/objects/gameObject";
import { State } from "../../../../../src/engine/stateMachine";
import { GrowNode } from "../GrowNode";
import { WaitingToGrowState } from "./WaitingToGrowState";

export class IdleState extends State {
  private grow = false;
  private readonly boundPointerDown: Handler;

  constructor(private node: GrowNode) {
    super();
    this.boundPointerDown = this.onPointerDown.bind(this);
  }

  public enter(): void {
    this.node.registerHandler("onPointerDown", this.boundPointerDown);
  }

  public getName(): string {
    return "IDLE";
  }

  public leave(): void {
    this.node.removeHandler("onPointerDown", this.boundPointerDown);
  }

  public update(delta: number): State | null {
    if (this.grow) {
      return new WaitingToGrowState(this.node);
    }

    return null;
  }

  private onPointerDown(): void {
    this.grow = true;
  }
}
