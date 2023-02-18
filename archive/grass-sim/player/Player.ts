import { DisplayObject } from "../../../src/engine/objects/displayObject";
import { Vec, vec } from "../../engine/vec";
import { GRID_UNIT } from "../../../src/engine/settings";
import { StateMachine } from "../../../src/engine/stateMachine";
import { PlayerIdleState } from "./state/PlayerIdleState";
import { levelManager, renderer } from "../global";
import { Color } from "../../../src/engine/color";

export function createPlayer(p: Vec = vec()): Player {
  const sm = new StateMachine();
  const player = new Player(p, sm);
  sm.init(new PlayerIdleState(player));
  return player;
}

export class Player extends DisplayObject {
  private availablePaths: Vec[][] = [];
  constructor(pos: Vec, sm: StateMachine) {
    super(0, pos, "player", vec(-(GRID_UNIT / 4), -(GRID_UNIT / 2)));
    this.stateMachine = sm;
  }

  public setAvailablePaths(paths: Vec[][]): void {
    this.availablePaths = paths;
  }

  draw() {
    const level = levelManager.getActiveLevel();

    super.draw();
    for (const path of this.availablePaths) {
      for (const p of path) {
        renderer.fillISoRect(
          level.vecToWorld(p).add(0, -8),
          GRID_UNIT,
          GRID_UNIT,
          Color.white(0.5),
          666
        );
      }
    }
  }

  getName(): string {
    return "PLAYER";
  }
}
