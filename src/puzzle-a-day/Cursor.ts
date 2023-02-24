import { DisplayObject } from "../engine/objects/displayObject";
import { vec } from "../engine/units/vec";
import { input, renderer } from "../engine/global";
import { Color } from "../engine/color";
import { DEFAULT_LAYER } from "../engine/renderer/renderer";
import { KeyInput, PointerState } from "../engine/input/input";
import { PieceManager } from "./global";
import { Piece } from "./Piece";

export function createCursor(): Cursor {
  return new Cursor(0, vec());
}

class Cursor extends DisplayObject {
  getName(): string {
    return "CURSOR";
  }

  private getPiece(): Piece | null {
    // assume cursor only ever has 1 child
    // TODO: does this need more enforcement?
    const child = [...this.children.values()][0];
    if (child instanceof Piece) {
      return child;
    }
    return null;
  }

  public add(piece: Piece): void {
    const grid = PieceManager.getGrid();
    const cursorLocalPos = grid.worldToLocalUnsafe(this.pos);
    const pieceLocalPos = grid.worldToLocalUnsafe(piece.pos);

    piece.setAnchor(cursorLocalPos.subv(pieceLocalPos));
    piece.setPos(piece.pos.subv(this.pos));
    super.add(piece);
  }

  public update(delta: number): void {
    this.pos = input.pointer.getWorldPos();
    const piece = this.getPiece();
    const cursorPos = PieceManager.getGrid().worldToLocalSnap(this.pos);

    if (!cursorPos) {
      return;
    }

    if (piece) {
      switch (input.getKeyDownThisFrame()) {
        case KeyInput.Rotate:
          piece.rotate();
          break;
        case KeyInput.Flip:
          piece.flip();
          break;
      }

      PieceManager.updateTempPlacement(piece, cursorPos.local);
    }

    if (
      input.isPointerDownThisFrame() &&
      input.pointer.state === PointerState.Primary
    ) {
      if (piece) {
        if (!PieceManager.canPlace(piece, cursorPos.local)) {
          console.log("cannot place at: ", cursorPos.local);
          return;
        }

        this.remove(piece);
        PieceManager.addPieceToGrid(piece, cursorPos.local);
      } else {
        const pieceOnGrid = PieceManager.getPieceAt(this.pos);
        if (pieceOnGrid) {
          PieceManager.removePieceFromGrid(pieceOnGrid);
          this.add(pieceOnGrid);
        }
      }
    }
  }

  public debug(): void {
    super.debug();
    const piece = this.getPiece();
    if (piece) {
      piece.debug();
    }
  }

  public draw(): void {
    renderer.fillRect(this.pos, 10, 10, Color.black(), vec(), DEFAULT_LAYER);
    renderer.fillRect(
      this.pos.add(2, 2),
      6,
      6,
      Color.white(),
      vec(),
      DEFAULT_LAYER + 1
    );
  }
}
