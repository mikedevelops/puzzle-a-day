import { createPiece, Piece } from "../Piece";
import { Direction, Vec, vec } from "../../engine/units/vec";
import { Color } from "../../engine/color";
import { GRID_UNIT, GRID_WIDTH } from "../../engine/settings";

type PieceFactory = (pos?: Vec, dir?: Direction, anchor?: Vec) => Piece;

// TODO: I don't like this at all, use strings that match the assets
export enum PieceName {
  Lightning = "lightning",
  C = "c",
  GolfClub = "golf_club",
  LessThan = "less_than",
  Lamppost = "lamppost",
  Brick = "brick",
  Bolt = "bolt",
  L = "l",
}

export const pieceFactory = new Map<PieceName, PieceFactory>([
  /*
  [
    PieceName.C,
    (pos = vec(), dir = Direction.North) =>
      createPiece(
        PieceName.C,
        `
x,x,o,
x,o,o
x,x,o
    `,
        vec(0, 0),
        Color.green(),
        "puzzle_2",
        vec(-GRID_UNIT * 3, -GRID_UNIT * 2),
        dir,
        pos
      ),
  ],
  */
  [
    PieceName.Lightning,
    (pos = vec(), dir = Direction.North) =>
      createPiece(
        PieceName.Lightning,
        `
x,o,o,
x,x,o
o,x,o
o,x,o
    `,
        vec(0, 0),
        Color.white(),
        { prefix: "piece_1", frame: 0 },
        vec(-GRID_UNIT * 3, -GRID_UNIT * 1.5),
        dir,
        pos
      ),
  ],
  /*
  [
    PieceName.GolfClub,
    (pos = vec(), dir = Direction.North) =>
      createPiece(
        PieceName.GolfClub,
        `
x,o,o
x,x,o
x,x,o
    `,
        vec(0, 0),
        Color.magenta(),
        "puzzle_3",
        vec(-GRID_UNIT * 3, -GRID_UNIT * 2),
        dir,
        pos
      ),
  ],
  [
    PieceName.LessThan,
    (pos = vec(), dir = Direction.North) =>
      createPiece(
        PieceName.LessThan,
        `
x,o,o
x,o,o
x,x,x
    `,
        vec(0, 0),
        Color.blue(),
        "puzzle_4",
        vec(-GRID_UNIT * 3, -GRID_UNIT * 1.5),
        dir,
        pos
      ),
  ],
  [
    PieceName.Lamppost,
    (pos = vec(), dir = Direction.North) =>
      createPiece(
        PieceName.Lamppost,
        `
x,o,o
x,x,o
x,o,o
x,o,o
    `,
        vec(0, 0),
        Color.red(),
        "puzzle_5",
        vec(-GRID_UNIT * 4, -GRID_UNIT * 2),
        dir,
        pos
      ),
  ],
  [
    PieceName.Brick,
    (pos = vec(), dir = Direction.North) =>
      createPiece(
        PieceName.Brick,
        `
x,x,o
x,x,o
x,x,o
    `,
        vec(0, 0),
        Color.blue(),
        "puzzle_6",
        vec(-GRID_UNIT * 3, -GRID_UNIT * 2),
        dir,
        pos
      ),
  ],
  [
    PieceName.Bolt,
    (pos = vec(), dir = Direction.North) =>
      createPiece(
        PieceName.Bolt,
        `
o,x,x
o,x,o
x,x,o
    `,
        vec(1, 0),
        Color.white(),
        "puzzle_7",
        vec(-GRID_UNIT * 3, -GRID_UNIT * 2),
        dir,
        pos
      ),
  ],
     */
  [
    PieceName.L,
    (pos = vec(), dir = Direction.North) =>
      createPiece(
        PieceName.L,
        `
x,o,o
x,o,o
x,o,o
x,x,o
    `,
        vec(0, 0),
        Color.green(),
        { prefix: "piece_0", frame: 0 },
        vec(-GRID_UNIT * 4, -GRID_UNIT * 1.5),
        dir,
        pos
      ),
  ],
]);
