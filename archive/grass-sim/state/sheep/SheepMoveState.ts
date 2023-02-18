import { Sheep } from "../../sheep";
import { vec, Vec } from "../../../engine/vec";
import { State } from "../../../../src/engine/stateMachine";
import { path, renderer } from "../../global";
import { Color } from "../../../../src/engine/color";
import { DEBUG_LAYER } from "../../../../src/engine/renderer/renderer";

export class SheepMoveState extends State {
  public static Name = "SHEEP_MOVE";

  private delta = 0;
  private path: Vec[];
  private currentDest: Vec;
  private start: Vec;

  constructor(private sheep: Sheep, private speed: number) {
    super();

    this.start = this.sheep.pos.clone();
    const [_, ...rest] = path.findPath(this.start, this.sheep.getNextPos());
    this.path = rest;

    if (!this.path[0]) {
      throw new Error("No Path for sheep move state!");
    }

    this.currentDest = this.path[0];
  }

  public enter(): void {
    // TODO: we can enter a move state _between_ points, we should figure this out and adjust the speed.
    //  Currently if we resume at 50% between two points the sheep will appear to move 50% slower as it uses
    //  the full speed delta to travel a shorter distance
  }

  public leave(): void {}

  public update(delta: number): State | null {
    this.delta += delta;
    this.sheep.pos = Vec.lerp(
      this.start,
      this.currentDest,
      this.delta / this.speed
    );

    const current = this.sheep.getStack().pos;
    const next = this.sheep.pos.round();

    if (!current.equalsv(next)) {
      this.sheep.moveToStack(next);
    }

    if (this.delta < this.speed) {
      return null;
    }

    this.sheep.pos = this.currentDest.clone(); // snap to dest
    this.start = this.sheep.pos.clone();
    this.path.shift();

    if (this.path[0]) {
      this.currentDest = this.path[0];
      this.delta = 0;
      return null;
    }

    return this.sheep.getNextState();
  }

  public debug(): void {
    const wp = this.path.map((p) => this.sheep.getWorldPos(p));
    renderer.path(wp, Color.red(), DEBUG_LAYER);
  }

  public getName(): string {
    return SheepMoveState.Name;
  }
}
