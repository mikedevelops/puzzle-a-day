import { createId } from "../engine/id/id";
import { Direction, vec, Vec } from "../engine/units/vec";
import { Color, SerialisedColor } from "../engine/color";
import { renderer } from "../engine/global";
import { DEBUG_PIECES, DRAW_PIECES, GRID_UNIT } from "../engine/settings";
import { PieceManager } from "./global";
import * as matrix from "../engine/units/matrix";
import { Axis } from "../engine/units/matrix";
import { BACKGROUND_LAYER, DEBUG_LAYER } from "../engine/renderer/renderer";
import { SpriteObject } from "../engine/objects/spriteObject";
import { PieceName } from "./pieces/piece-factory";

const id = createId();

interface PieceNode {
  local: Vec;
  occupied: boolean;
}

// TODO: move this out of this file, it doesn't belong here
function parse(piece: string): PieceNode[][] {
  const pGrid: PieceNode[][] = [];
  const rows = piece.split("\n").filter((r) => r.length !== 0);
  for (let y = 0; y < rows.length; y++) {
    const nodes = rows[y].split(",").filter((n) => n !== "");
    for (let x = 0; x < nodes.length; x++) {
      if (pGrid[x] === undefined) {
        pGrid[x] = [];
      }

      switch (nodes[x]) {
        case "x":
          pGrid[x][y] = {
            local: vec(x, y),
            occupied: true,
          };
          break;
        case "o":
          pGrid[x][y] = {
            local: vec(x, y),
            occupied: false,
          };
          break;
      }
    }
  }
  return pGrid;
}

export function createPiece(
  name: PieceName,
  grid: string,
  anchor: Vec,
  color: Color,
  sprite: string,
  offset = vec(),
  dir = Direction.North,
  pos = vec()
): Piece {
  return new Piece(name, pos, parse(grid), color, dir, anchor, sprite, offset);
}

export interface SerialisedPiece {
  localPos: Vec;
  shape: PieceNode[][];
  direction: Vec;
  color: SerialisedColor;
  anchor: Vec;
  name: PieceName;
}

export class Piece extends SpriteObject {
  private anchor = vec();

  private needsUpdate = false;

  getName(): string {
    return `${this.id}_PIECE`;
  }

  constructor(
    private name: PieceName,
    pos: Vec,
    public shape: PieceNode[][],
    private color: Color,
    public direction: Direction = Direction.North,
    anchor = vec(0, 0),
    sprite: string,
    offset: Vec
  ) {
    super(id(), pos, sprite, offset);
    this.setAnchor(anchor);
  }

  public setPos(worldPos: Vec): void {
    console.log(
      "set pos",
      worldPos,
      this.getGrid().worldToLocalUnsafe(worldPos)
    );
    if (worldPos.equalsv(this.pos)) {
      console.warn("skipping piece pos update");
      return;
    }

    super.setPos(worldPos);

    if (this.needsUpdate) {
      PieceManager.updatePiece(this);
      this.needsUpdate = false;
    }
  }

  public rotate(): void {
    this.needsUpdate = true;
    const transposed = matrix.transpose(this.shape);
    this.shape = matrix.flipVertically(transposed);

    switch (this.direction) {
      case Direction.North:
        this.direction = Direction.East;
        break;
      case Direction.East:
        this.direction = Direction.South;
        break;
      case Direction.South:
        this.direction = Direction.West;
        break;
      case Direction.West:
        this.direction = Direction.North;
        break;
    }
  }

  public flip(): void {
    this.needsUpdate = true;
    switch (this.direction) {
      case Direction.North:
      case Direction.South:
        this.shape = matrix.inverse(this.shape, Axis.X);
        return;
      case Direction.East:
      case Direction.West:
        this.shape = matrix.inverse(this.shape, Axis.Y);
        return;
    }
  }

  public getNodes(): Vec[] {
    const nodes: Vec[] = [];
    this.forEach((pos, occupied) => {
      if (!occupied) {
        return;
      }
      nodes.push(pos);
    });
    return nodes;
  }

  public forEach(cb: (pos: Vec, occupied: boolean) => void): void {
    for (let x = 0; x < this.shape.length; x++) {
      for (let y = 0; y < this.shape[x].length; y++) {
        cb(vec(x, y), this.shape[x][y].occupied);
      }
    }
  }

  public draw() {
    if (!DRAW_PIECES) {
      return;
    }

    super.draw();
  }

  public setAnchor(pos: Vec): void {
    this.anchor = pos;
  }

  public getAnchor(): Vec {
    return this.anchor;
  }

  public debug(): void {
    if (!DEBUG_PIECES) {
      return;
    }

    super.debug();

    const grid = this.getGrid();
    const size = grid.size;
    const wp = this.getWorldPos();
    const anchor = grid.localToWorld(this.anchor).addv(wp);

    renderer.drawISoRect(
      anchor,
      size / 3,
      size / 3,
      Color.white(),
      false,
      vec(),
      2,
      DEBUG_LAYER
    );

    this.forEach((p, occupied) => {
      const pos = grid.localToWorld(p).addv(wp);
      renderer.drawISoRect(
        pos,
        size,
        size,
        this.color,
        occupied,
        vec(0, -size / 2),
        4,
        BACKGROUND_LAYER
      );
    });
  }

  private serialiseShape(): PieceNode[][] {
    const grid: PieceNode[][] = [];
    for (let x = 0; x < this.shape.length; x++) {
      if (!grid[x]) grid[x] = [];
      for (let y = 0; y < this.shape[x].length; y++) {
        grid[x][y] = {
          local: this.shape[x][y].local,
          occupied: this.shape[x][y].occupied,
        };
      }
    }
    return grid;
  }

  private serialiseDirection(): Vec {
    switch (this.direction) {
      case Direction.North:
        return Vec.north();
      case Direction.East:
        return Vec.east();
      case Direction.South:
        return Vec.south();
      case Direction.West:
        return Vec.west();
    }
  }

  public serialise(): SerialisedPiece {
    return {
      localPos: this.getGrid().worldToLocalUnsafe(this.pos),
      shape: this.serialiseShape(),
      direction: this.serialiseDirection(),
      color: this.color.serialise(),
      anchor: this.anchor,
      name: this.name,
    };
  }
}
