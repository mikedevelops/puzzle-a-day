import { createPiece, Piece } from "../Piece";
import { Direction, Vec, vec } from "../../engine/units/vec";
import { Color } from "../../engine/color";
import { GRID_UNIT, GRID_WIDTH } from "../../engine/settings";

type PieceFactory = (pos?: Vec, dir?: Direction, anchor?: Vec) => Piece;

export enum PieceName {
  Tee = "tee",
  Lightning = "lightning",
  C = "c",
  GolfClub = "golf_club",
  LessThan = "less_than",
  Lamppost = "lamppost",
  Brick = "brick",
  Bolt = "bolt",
}

export const pieceFactory = new Map<PieceName, PieceFactory>([
  [
    PieceName.Tee,
    (pos = vec(), dir = Direction.North) =>
      createPiece(
        PieceName.Tee,
        `
o,x,o,
o,x,x
o,x,o
    `,
        vec(1, 0),
        Color.red(),
        "puzzle_0",
        vec(-GRID_UNIT * 2, -GRID_UNIT * 2),
        dir,
        pos
      ),
  ],
]);

// const piece2 = createPiece(
//     `
// x,o,o,o
// x,x,o,o
// o,x,o,o
// o,x,o,o
//     `,
//     vec(1, 1),
//     Color.green(),
//     "puzzle_1",
//     vec(-GRID_UNIT * 1.5, -GRID_UNIT / 1.5)
// );
//
// const piece3 = createPiece(
//     `
// x,o,o,o
// x,x,o,o
// x,o,o,o
// x,o,o,o
//     `,
//     vec(0, 1),
//     Color.red(),
//     "puzzle_5",
//     vec(-GRID_UNIT * 2, -GRID_UNIT)
// );
//
// const piece4 = createPiece(
//     `
// x,x,o
// x,x,o
// x,x,o
//     `,
//     vec(0, 1),
//     Color.white(),
//     "puzzle_6",
//     vec(-GRID_UNIT * 1.5, -GRID_UNIT)
// );
//
// // const piece5 = createPiece(
// //   `
// // x,o,o,o
// // x,o,o,o
// // x,o,o,o
// // x,x,o,o
// //     `,
// //   vec(0, 2),
// //   Color.magenta()
// // );
//
// const piece6 = createPiece(
//     `
// o,x,x,
// o,x,o,
// x,x,o,
//     `,
//     vec(1, 1),
//     Color.green(),
//     "puzzle_7",
//     vec(-GRID_UNIT * 1.5, -GRID_UNIT)
// );
//
// const piece7 = createPiece(
//     `
// x,o,o,
// x,o,o,
// x,x,x,
//     `,
//     vec(0, 1),
//     Color.red(),
//     "puzzle_4",
//     vec(-GRID_UNIT * 1.5, -GRID_UNIT * 0.75)
// );
//
// const piece8 = createPiece(
//     `
// x,o,o
// x,x,o
// x,x,o
//     `,
//     vec(1, 1),
//     Color.magenta(),
//     "puzzle_3",
//     vec(-GRID_UNIT * 1.5, -GRID_UNIT)
// );
