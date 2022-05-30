import { State } from "../../engine/stateMachine";
import { Sheep } from "../sheep";

export class GrazeState implements State {
  public readonly name = "GRAZE";

  private grazeDelta = 0;

  constructor(private sheep: Sheep, private grazeRate: number) {}

  public enter(): void {}

  public leave(): void {}

  public update(delta: number): State | null {
    if (!this.sheep.canGraze()) {
      return this.sheep.getNextState();
    }

    this.grazeDelta += delta;
    if (this.grazeDelta < this.grazeRate) {
      return null;
    }

    this.sheep.getParent().graze(this.sheep.pos);
    return this.sheep.getNextState();
  }
}
