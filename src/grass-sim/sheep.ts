import { DisplayObject } from "../engine/displayObject";
import { Vec, vec } from "../engine/vec";
import { randRange } from "../engine/maths";
import {
  SHEEP_GRAZE_RATE,
  SHEEP_IDLE_WAIT,
  SHEEP_SPEED,
} from "../engine/settings";
import { createStateMachine, State } from "../engine/stateMachine";
import { IdleWaitState, S_IDLE_WAIT } from "./state/IdleWaitState";
import { renderer } from "./global";
import { randItem } from "../engine/array";
import { GrazeState } from "./state/GrazeState";
import { MoveState } from "./state/MoveState";
import { Color } from "../engine/color";
import { DEBUG_LAYER } from "../engine/renderer";
import { DEBUG_SHEEP } from "../engine/settings";

export function createSheep(): Sheep {
  return new Sheep(vec(), randRange(SHEEP_GRAZE_RATE, 0.5));
}

function wait(): number {
  return randRange(SHEEP_IDLE_WAIT, 0.25);
}

export class Sheep extends DisplayObject {
  public stateMachine = createStateMachine(new IdleWaitState(this, wait()));

  constructor(pos: Vec, private grazeRate: number) {
    super(pos, "sheep");
  }

  public getNextState(): State {
    return randItem([
      new IdleWaitState(this, wait()),
      new GrazeState(this, this.grazeRate),
      new GrazeState(this, this.grazeRate),
      new GrazeState(this, this.grazeRate),
      new GrazeState(this, this.grazeRate),
      new GrazeState(this, this.grazeRate),
      new GrazeState(this, this.grazeRate),
      new MoveState(this, randRange(SHEEP_SPEED, 0.5)),
      new MoveState(this, randRange(SHEEP_SPEED, 0.5)),
    ]);
  }

  public update(delta: number) {
    this.stateMachine.update(delta);
  }

  public debug() {
    super.debug();

    if (DEBUG_SHEEP) {
      renderer.fillText(
        this.stateMachine.getActiveState(),
        this.getWorldPos(),
        Color.blue(),
        DEBUG_LAYER
      );
    }
  }

  public canGraze(): boolean {
    return this.getParent().getStack(this).grassLength() > 0;
  }
}
