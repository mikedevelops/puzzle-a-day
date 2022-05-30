import { State } from "../../engine/stateMachine";
import { Sheep } from "../sheep";
import { Stack } from "../stack";
import { Vec } from "../../engine/vec";

export class MoveState implements State {
  public readonly name = "MOVE";

  private delta = 0;
  private dest: Stack;
  private movedStack = false;
  private readonly dir: Vec;
  private readonly start: Vec;

  constructor(private sheep: Sheep, private speed: number) {
    this.dest = this.sheep.getParent().getNextStack(this.sheep);
    this.dir = this.sheep.pos.dir(this.dest.pos);
    this.start = this.sheep.pos.clone();
  }

  public enter(): void {}

  public leave(): void {}

  public update(delta: number): State | null {
    this.delta += delta;
    this.sheep.pos = Vec.lerp(
      this.start,
      this.dest.pos,
      this.delta / this.speed
    );

    if (!this.movedStack && this.delta > this.speed / 2) {
      this.movedStack = true;
      this.sheep.getParent().moveTo(this.sheep, this.dest);
    }

    if (this.delta < this.speed) {
      return null;
    }

    this.sheep.pos = this.dest.pos; // snap to dest
    return this.sheep.getNextState();
  }
}
