import { DisplayObject } from "../engine/displayObject";
import { Vec, vec } from "../engine/vec";
import { Color } from "../engine/color";
import { createCollider } from "../engine/collider";
import { GRID_UNIT } from "../engine/settings";
import { createStateMachine } from "../engine/stateMachine";
import { IdleState } from "./state/IdleState";

export function createGrass(pos = vec()): Grass {
  const collider = createCollider(
    [
      vec(0, 0),
      vec(GRID_UNIT, GRID_UNIT / 2),
      vec(GRID_UNIT, GRID_UNIT),
      vec(0, GRID_UNIT + GRID_UNIT / 2),
      vec(-GRID_UNIT, GRID_UNIT),
      vec(-GRID_UNIT, GRID_UNIT / 2),
      vec(0, 0),
    ],
    vec(0, -GRID_UNIT)
  );
  const grass = new Grass(pos);
  grass.addCollider(collider);
  return grass;
}

export class Grass extends DisplayObject {
  public stateMachine = createStateMachine(new IdleState());

  constructor(pos: Vec) {
    super(pos, "grass-section");
  }

  public getTopOfStack(): Grass | null {
    return this.getParent().getStack(this).getTopOfStack();
  }

  public onPointerOver() {
    this.tint = Color.white();
  }

  public onPointerOut() {
    this.tint = Color.empty();
  }

  public onPointerDown() {
    this.tint = Color.white();
    this.getParent().graze(this.pos);
  }

  public onPointerUp() {
    this.tint = Color.empty();
    this.destroy();
  }

  public debug(): void {
    super.debug();
  }
}
