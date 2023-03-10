import { Piece } from "./Piece";
import { Grid } from "../engine/grid";
import { vec, Vec } from "../engine/units/vec";
import { renderer } from "../engine/global";
import { Color } from "../engine/color";
import { BACKGROUND_LAYER, DEBUG_LAYER } from "../engine/renderer/renderer";
import { DEBUG_PIECE_MANAGER } from "../engine/settings";
import { Board } from "./board/Board";

export function createPieceManager(): PieceManager {
  return new PieceManager();
}

export class PieceManager {
  private pieceMatrix: (Piece | null)[][] = [];
  private pieces: Set<Piece> = new Set();
  private grid: Grid | null = null;
  private board: Board | null = null;

  private debugTempPlacement: Vec[] = [];

  public reset(): void {
    this.pieces.clear();

    for (let x = 0; x < this.pieceMatrix.length; x++) {
      for (let y = 0; y < this.pieceMatrix[x].length; y++) {
        this.pieceMatrix[x][y] = null;
      }
    }
  }

  public start(grid: Grid) {
    this.grid = grid;
    this.grid.forEach((node) => {
      if (this.pieceMatrix[node.local.x] === undefined) {
        this.pieceMatrix[node.local.x] = [];
      }
      this.pieceMatrix[node.local.x][node.local.y] = null;
    });
  }

  public getPieces(): Set<Piece> {
    return this.pieces;
  }

  public getGrid(): Grid {
    if (this.grid === null) {
      throw new Error("Attempted to access grid before it was initialised");
    }
    return this.grid;
  }

  public getBoard(): Board {
    if (this.board === null) {
      throw new Error("No board in piece manager");
    }
    return this.board;
  }

  public getPieceAt(worldPos: Vec): Piece | null {
    const pos = this.getGrid().worldToLocalSnap(worldPos);
    if (!pos) {
      return null;
    }

    return this.pieceMatrix[pos.local.x][pos.local.y];
  }

  public removePieceFromGrid(piece: Piece): void {
    this.getGrid().forEach((node) => {
      const p = this.pieceMatrix[node.local.x][node.local.y];
      if (p === piece) {
        this.pieceMatrix[node.local.x][node.local.y] = null;
      }
    });
    this.pieces.delete(piece);
  }

  public addBoardToGrid(board: Board, localPos: Vec): void {
    this.board = board;
    this.board.updateLocalRect(localPos);
    this.getGrid().add(board, localPos);
  }

  public addPieceToGrid(piece: Piece, localPos: Vec) {
    if (this.pieces.has(piece)) {
      this.removePieceFromGrid(piece);
    }

    this.getGrid().add(piece, localPos.subv(piece.getAnchor()));
    const localPiecePos = this.getGrid().worldToLocalUnsafe(piece.pos);

    const nodes = this.getPieceLocalNodesAtLocalPos(piece, localPiecePos);
    for (const node of nodes) {
      this.pieceMatrix[node.x][node.y] = piece;
    }

    this.pieces.add(piece);
  }

  public isPuzzleComplete(): boolean {
    const board = this.getBoard();
    const solution = board.getSolutionNodes();
    const freeNodes: Vec[] = [];
    for (const node of board.getNodes()) {
      if (this.pieceMatrix[node.x][node.y] === null) {
        freeNodes.push(Vec.from(node));
      }
    }

    return Vec.isMatchingList(solution, freeNodes);
  }

  public updatePiece(piece: Piece): void {
    if (!this.pieces.has(piece)) {
      console.warn(
        `Cannot update piece ${piece.getName()}, it was not registered`
      );
      return;
    }

    const pos = this.getGrid().worldToLocalSnap(piece.pos);

    if (pos === null) {
      console.warn("Cannot update piece as it is OOB", piece);
      return;
    }

    // TODO: these loops can be consolidated
    this.removePieceFromGrid(piece);
    this.addPieceToGrid(piece, pos.local);
  }

  public updateTempPlacement(piece: Piece, localPos: Vec): void {
    const localPosWithAnchor = localPos.subv(piece.getAnchor());
    const nodes = this.getPieceLocalNodesAtLocalPos(piece, localPosWithAnchor);
    this.debugTempPlacement = nodes.map((p) =>
      this.getGrid()
        .localToWorld(p)
        .sub(0, this.getGrid().size / 2)
    );
  }

  public getPieceLocalNodesAtLocalPos(piece: Piece, localPos: Vec): Vec[] {
    return piece.getNodes().map((p) => p.addv(localPos));
  }

  public canPlace(piece: Piece, localPos: Vec): boolean {
    const localPosWithAnchor = localPos.subv(piece.getAnchor());
    const pieceNodes = this.getPieceLocalNodesAtLocalPos(
      piece,
      localPosWithAnchor
    );
    for (const node of pieceNodes) {
      if (this.pieceMatrix[node.x][node.y] !== null) {
        return false;
      }
    }

    if (!this.getBoard().isValidPlacement(pieceNodes)) {
      return false;
    }

    return true;
  }

  public debug(): void {
    if (!DEBUG_PIECE_MANAGER) {
      return;
    }

    const size = this.getGrid().size;
    this.getGrid().forEach((node) => {
      if (this.pieceMatrix[node.local.x][node.local.y] instanceof Piece) {
        renderer.fillRect(
          node.world,
          size / 4,
          size / 4,
          Color.white(),
          vec(),
          DEBUG_LAYER
        );
      }
    });

    for (const pos of this.debugTempPlacement) {
      renderer.drawISoRect(
        pos,
        this.getGrid().size,
        this.getGrid().size,
        Color.green(0.75),
        true,
        vec(),
        4,
        BACKGROUND_LAYER
      );
    }
  }
}
