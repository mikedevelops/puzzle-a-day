import { State } from "../../../../src/engine/stateMachine";
import { Vec } from "../../../engine/vec";
import { levelManager } from "../../global";
import { Player } from "../Player";

export class PlayerIdleState extends State {
  constructor(private player: Player) {
    super();
  }

  enter(): void {
    this.player.setAvailablePaths([
      this.calculatePath(Vec.north()),
      this.calculatePath(Vec.east()),
      this.calculatePath(Vec.south()),
      this.calculatePath(Vec.west()),
    ]);
  }

  private calculatePath(dir: Vec): Vec[] {
    const level = levelManager.getActiveLevel();
    const playerPos = level.worldToLocalSnap(this.player.pos);
    if (playerPos === null) {
      throw new Error(`Player ${this.player.pos.toString()} is not on grid!`);
    }

    return level.getPathTo(playerPos.local, dir);
  }

  getName(): string {
    return "PLAYER_IDLE";
  }

  leave(): void {}

  update(delta: number): State | null {
    return null;
  }
}
