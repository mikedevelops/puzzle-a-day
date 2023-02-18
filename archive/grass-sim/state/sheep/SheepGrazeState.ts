import { Sheep } from "../../sheep";
import { State } from "../../../../src/engine/stateMachine";

export class SheepGrazeState extends State {
  public static Name = "GRAZE";

  private grazeDelta = 0;

  constructor(private sheep: Sheep, private grazeRate: number) {
    super();
  }

  public getName(): string {
    return SheepGrazeState.Name;
  }

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

    this.sheep.graze();
    return this.sheep.getNextState();
  }
}
