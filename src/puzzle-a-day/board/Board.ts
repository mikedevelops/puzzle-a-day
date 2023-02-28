import { vec, Vec } from "../../engine/units/vec";
import { SpriteObject } from "../../engine/objects/spriteObject";
import { renderer } from "../../engine/global";
import { Color } from "../../engine/color";
import { DEBUG_BOARD, GRID_UNIT } from "../../engine/settings";
import { BACKGROUND_LAYER, DEBUG_LAYER } from "../../engine/renderer/renderer";
import { rect, Rect } from "../../engine/units/rect";

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
