import { Grid } from "../engine/grid";
import { vec, Vec } from "../engine/units/vec";
import { DEBUG_GRID, GRID_UNIT } from "../engine/settings";
import { input, renderer } from "../engine/global";
import { Color } from "../engine/color";
import { DEBUG_LAYER } from "../engine/renderer/renderer";
import { GameObject } from "../engine/objects/gameObject";
import { Piece } from "./Piece";
import { DisplayObject } from "../engine/objects/displayObject";

enum NodeState {
  OOB,
  Empty,
  Occupied,
}

interface PuzzleGridNode {
  state: NodeState;
  local: Vec;
  piece: Piece | null; // TODO: Piece
  value: string;
}

interface Node {
  world: Vec;
  local: Vec;
}

function parse(grid: string): PuzzleGridNode[][] {
  const pGrid: PuzzleGridNode[][] = [];
  const rows = grid.split("\n").filter((r) => r.length !== 0);
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
            state: NodeState.OOB,
            piece: null,
            value: nodes[x],
          };
          break;
        default:
          pGrid[x][y] = {
            local: vec(x, y),
            state: NodeState.Empty,
            piece: null,
            value: nodes[x],
          };
          break;
      }
    }
  }
  return pGrid;
}

export function createPuzzleGrid(grid: string, pos: Vec): PuzzleGrid {
  return new PuzzleGrid(parse(grid), pos);
}

export class PuzzleGrid extends DisplayObject {
  private size = GRID_UNIT;
  private pieceMatrix: (Piece | null)[][] = [];

  public getName(): string {
    return "PUZZLE_GRID";
  }

  // TODO: call grid something else... getGrid() returns a different grid than this.grid
  constructor(private grid: PuzzleGridNode[][], pos: Vec) {
    super(0, pos);

    for (let x = 0; x < this.grid.length; x++) {
      this.pieceMatrix[x] = [];
      for (let y = 0; y < this.grid[x].length; y++) {
        this.pieceMatrix[x][y] = null;
      }
    }
  }

  public addPiece(piece: Piece, localPos: Vec): void {
    const nodes = piece.getNodes().map((p) => p.addv(localPos));
    for (const node of nodes) {
      const pos = this.translateLocalPos(node);
      this.pieceMatrix[pos.x][pos.y] = piece;
    }

    this.add(
      piece,
      this.getGrid().localToWorld(this.translateLocalPos(localPos))
    );
  }

  public removePiece(piece: Piece, parent: GameObject): void {
    if (!this.hasChild(piece)) {
      return;
    }

    this.forEach(({ local }) => {
      if (this.pieceMatrix[local.x][local.y] === piece) {
        this.pieceMatrix[local.x][local.y] = null;
      }
    });

    this.remove(piece);
    parent.add(piece);
  }

  private translateLocalPos(localPos: Vec): Vec {
    return localPos.subv(this.getGrid().worldToLocalUnsafe(this.pos));
  }

  public canPlace(piece: Piece, localPos: Vec): boolean {
    const nodes = piece.getNodes().map((p) => p.addv(localPos));
    for (const node of nodes) {
      const pos = this.translateLocalPos(node);
      if (!this.contains(pos)) {
        return false;
      }

      if (this.pieceMatrix[pos.x][pos.y] !== null) {
        return false;
      }
    }

    return true;
  }

  public localToWorld(p: Vec): Vec {
    return Grid.cartToIso(p).multiply(this.size).addv(this.pos);
  }

  public forEach(cb: (node: PuzzleGridNode & { world: Vec }) => void): void {
    for (let x = 0; x < this.grid.length; x++) {
      for (let y = 0; y < this.grid[x].length; y++) {
        cb({
          ...this.grid[x][y],
          world: this.localToWorld(this.grid[x][y].local),
        });
      }
    }
  }

  public isOver(worldPos: Vec): Vec | null {
    const pos = this.worldToLocalSnap(worldPos);
    if (pos === null) {
      return null;
    }
    return pos.local;
  }

  private contains(localPos: Vec): boolean {
    let cx = false,
      cy = false;

    // TODO: optimise
    this.forEach(({ local }) => {
      if (local.x == localPos.x) cx = true;
      if (local.y == localPos.y) cy = true;
      if (cx && cy) return;
    });

    return cx && cy;
  }

  public worldToLocalSnap(v: Vec): Node | null {
    const local = Grid.isoToCart(v).divide(this.size).round();

    if (!this.contains(local)) {
      return null;
    }

    return {
      local: local,
      world: this.localToWorld(local),
    };
  }

  public debug(): void {
    if (!DEBUG_GRID) {
      return;
    }

    this.forEach(({ local, world }) => {
      const occupied = this.pieceMatrix[local.x][local.y] !== null;
      renderer.drawISoRect(
        world.add(0, this.getGrid().size / 2),
        this.size,
        this.size,
        occupied ? Color.red(0.5) : Color.white(1),
        occupied,
        vec(),
        2,
        DEBUG_LAYER
      );
      renderer.fillText(
        this.grid[local.x][local.y].value,
        // local.toString(),
        world.add(-12, 0),
        Color.green(),
        this.size * 2,
        DEBUG_LAYER
      );
    });
  }
}
