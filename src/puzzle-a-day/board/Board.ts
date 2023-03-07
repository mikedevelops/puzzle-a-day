import { vec, Vec } from "../../engine/units/vec";
import { SpriteObject } from "../../engine/objects/spriteObject";
import { events, renderer } from "../../engine/global";
import { Color } from "../../engine/color";
import { DEBUG_BOARD, GRID_UNIT } from "../../engine/settings";
import { BACKGROUND_LAYER, DEBUG_LAYER } from "../../engine/renderer/renderer";
import { rect, Rect } from "../../engine/units/rect";
import { SafeMap } from "../../engine/units/primitives";
import { Day } from "../calendar/calendar";

export function createBoard(
  localWidth: number,
  localHeight: number,
  invalidNodes: Vec[],
  solution: Vec[]
): Board {
  return new Board(
    0,
    vec(),
    "puzzle_8",
    localWidth,
    localHeight,
    invalidNodes,
    solution
  );
}

const months = new SafeMap<number, Vec>([
  [0, vec(0, 1)],
  [1, vec(0, 2)],
  [2, vec(0, 3)],
  [3, vec(0, 4)],
  [4, vec(0, 5)],
  [5, vec(0, 6)],

  [6, vec(1, 1)],
  [7, vec(1, 2)],
  [8, vec(1, 3)],
  [9, vec(1, 4)],
  [10, vec(1, 5)],
  [11, vec(1, 6)],
]);

const days = new SafeMap<number, Vec>([
  [7, vec(2, 0)],
  [6, vec(2, 1)],
  [5, vec(2, 2)],
  [4, vec(2, 3)],
  [3, vec(2, 4)],
  [2, vec(2, 5)],
  [1, vec(2, 6)],

  [14, vec(3, 0)],
  [13, vec(3, 1)],
  [12, vec(3, 2)],
  [11, vec(3, 3)],
  [10, vec(3, 4)],
  [9, vec(3, 5)],
  [8, vec(3, 6)],

  [21, vec(4, 0)],
  [20, vec(4, 1)],
  [19, vec(4, 2)],
  [18, vec(4, 3)],
  [17, vec(4, 4)],
  [16, vec(4, 5)],
  [15, vec(4, 6)],

  [28, vec(5, 0)],
  [27, vec(5, 1)],
  [26, vec(5, 2)],
  [25, vec(5, 3)],
  [24, vec(5, 4)],
  [23, vec(5, 5)],
  [22, vec(5, 6)],

  [31, vec(6, 4)],
  [30, vec(6, 5)],
  [29, vec(6, 6)],
]);

export class Board extends SpriteObject {
  private localRect: Rect;
  constructor(
    id: number,
    pos: Vec,
    sprite: string,
    private localWidth: number,
    private localHeight: number,
    private invalidNodes: Vec[],
    private solution: Vec[]
  ) {
    super(id, pos, sprite, vec(-GRID_UNIT * 7, -GRID_UNIT / 2));
    this.localRect = rect(0, 0, this.localWidth, this.localHeight);

    events.listen("update_date", (payload: { date: Date }) => {
      this.solution[0] = months.get(payload.date.getMonth());
      this.solution[1] = days.get(payload.date.getDate());
    });
  }

  public getName(): string {
    return "BOARD";
  }

  public getLocalPos(): Vec {
    return this.getGrid().worldToLocalUnsafe(this.pos);
  }

  public updateLocalRect(localPos: Vec): void {
    this.localRect.pos = localPos.clone();
  }

  public isValidPlacement(nodes: Vec[]): boolean {
    // TODO (optimize): erm, yeah, a bit loop happy

    // if some nodes are in invalid positions
    const invalidNodesLocal = this.invalidNodes.map((n) =>
      n.addv(this.getLocalPos())
    );

    if (nodes.some((p) => invalidNodesLocal.find((n) => n.equalsv(p)))) {
      return false;
    }

    // if every node is in the board
    if (nodes.every((p) => this.localRect.contains(p))) {
      return true;
    }

    // if no nodes are in the board
    if (nodes.every((p) => !this.localRect.contains(p))) {
      return true;
    }

    // some nodes are in the board, but not all
    return false;
  }

  public draw() {
    super.draw(1, BACKGROUND_LAYER);

    const grid = this.getGrid();
    for (const p of this.solution) {
      renderer.drawISoRect(
        this.getWorldPos().addv(grid.localToWorld(p)),
        grid.size,
        grid.size,
        Color.green(),
        false,
        vec(0, -grid.size / 2),
        4,
        BACKGROUND_LAYER + 1
      );
    }
  }

  public getNodes(): Vec[] {
    const pos = this.getLocalPos();
    const nodes: Vec[] = [];
    for (let x = 0; x < this.localRect.width; x++) {
      for (let y = 0; y < this.localRect.height; y++) {
        const node = vec(x, y);
        if (this.invalidNodes.find((n) => n.equalsv(node))) {
          continue;
        }
        nodes.push(node.addv(pos));
      }
    }
    return nodes;
  }

  public getSolutionNodes(): Vec[] {
    return this.solution.map((p) => p.addv(this.getLocalPos()));
  }

  public debug() {
    if (!DEBUG_BOARD) {
      return;
    }
    const grid = this.getGrid();
    renderer.fillText(
      this.localRect.toString(),
      this.pos,
      Color.white(),
      999,
      DEBUG_LAYER
    );
    renderer.drawISoRect(
      this.pos,
      this.localRect.width * grid.size,
      this.localRect.height * grid.size,
      Color.white(0.5),
      true,
      vec(0, -grid.size / 2),
      4,
      DEBUG_LAYER
    );

    for (const node of this.solution) {
      const pos = this.pos.addv(this.getGrid().localToWorld(node));
      renderer.drawISoRect(
        pos,
        GRID_UNIT,
        GRID_UNIT,
        Color.green(0.75),
        true,
        vec(0, -GRID_UNIT / 2),
        4,
        DEBUG_LAYER
      );
    }

    for (const node of this.invalidNodes) {
      const pos = this.pos.addv(this.getGrid().localToWorld(node));
      renderer.drawISoRect(
        pos,
        GRID_UNIT,
        GRID_UNIT,
        Color.red(0.5),
        true,
        vec(0, -GRID_UNIT / 2),
        4,
        DEBUG_LAYER
      );
    }
  }
}
