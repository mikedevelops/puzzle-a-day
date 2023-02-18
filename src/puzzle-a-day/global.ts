import { createPuzzleGrid } from "./PuzzleGrid";
import { vec } from "../engine/units/vec";
import { createPieceManager } from "./PieceManager";
import { createGameState } from "./game-state/GameState";

export const PUZZLE_GRID_SIZE = 32;

export const PieceManager = createPieceManager();
export const PuzzleGrid = createPuzzleGrid(
  `
Jan,Feb,Mar,Apr,Mau,Jun,x,
Jul,Aug,Sep,Oct,Nov,Dec,x,
1,2,3,4,5,6,7,
8,9,10,11,12,13,14,
15,16,17,18,19,20,21,
22,23,24,25,26,27,28,
29,30,31,x,x,x,x,
`,
  vec(0, 0)
);
export const GameState = createGameState();
