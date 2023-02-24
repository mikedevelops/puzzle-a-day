import { Piece, SerialisedPiece } from "../Piece";
import { PieceManager } from "../global";
import { input, scenes } from "../../engine/global";
import { KeyInput } from "../../engine/input/input";
import { Direction, Vec, vec } from "../../engine/units/vec";
import { Color } from "../../engine/color";
import { pieceFactory } from "../pieces/piece-factory";

export function createGameState(): GameState {
  return new GameState();
}

interface SerialisedGameState {
  pieces: SerialisedPiece[];
}

class GameState {
  private savedState: SerialisedGameState | null = null;

  public update(): void {
    if (input.getKeyDownThisFrame() === KeyInput.Save) {
      this.saveState();
      return;
    }

    if (input.getKeyDownThisFrame() === KeyInput.Load) {
      this.loadState();
      return;
    }
  }

  private getSaveStateKey(): string {
    return "puzzle-a-day:game-state";
  }

  public saveState(): void {
    const pieces: SerialisedPiece[] = [];
    for (const piece of PieceManager.getPieces()) {
      pieces.push(piece.serialise());
    }

    const state: SerialisedGameState = {
      pieces,
    };

    localStorage.setItem(this.getSaveStateKey(), JSON.stringify(state));
    console.log("saved scene!", state);
  }

  public loadState(): void {
    const scene = scenes.getActiveScene();
    const serialisedState = localStorage.getItem(this.getSaveStateKey());
    scene.reset();

    if (serialisedState === null) {
      return;
    }

    const state: SerialisedGameState = JSON.parse(serialisedState);

    for (const p of state.pieces) {
      const piece = pieceFactory.get(p.name)!(
        vec(),
        Vec.deserialiseDirection(Vec.from(p.direction)),
        p.anchor
      );
      PieceManager.addPieceToGrid(piece, Vec.from(p.localPos));
    }
  }
}
