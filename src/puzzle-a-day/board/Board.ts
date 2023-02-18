import { vec, Vec } from "../../engine/units/vec";
import { SpriteObject } from "../../engine/objects/spriteObject";
import { renderer } from "../../engine/global";
import { Color } from "../../engine/color";
import { GRID_UNIT } from "../../engine/settings";

export function createBoard(localWidth: number, localHeight: number): Board {
  return new Board(0, vec(), "board", localWidth, localHeight);
}

class Board extends SpriteObject {
  constructor(
    id: number,
    pos: Vec,
    sprite: string,
    private localWidth: number,
    private localHeight: number
  ) {
    super(id, pos, sprite);
  }

  public getName(): string {
    return "BOARD";
  }

  public draw() {
    const grid = this.getGrid();
    renderer.drawISoRect(
      this.pos,
      this.localWidth * grid.size,
      this.localHeight * grid.size,
      Color.white(0.5),
      true,
      vec(0, -grid.size / 2)
    );
  }
}
