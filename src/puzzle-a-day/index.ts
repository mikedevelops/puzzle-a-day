import { createScene } from "../engine/scenes/scene";
import { startRuntime } from "../engine/runtime";
import { vec } from "../engine/units/vec";
import { camera, scenes } from "../engine/global";
import { createPiece, Piece } from "./Piece";
import { Color } from "../engine/color";
import { createCursor } from "./Cursor";
import { PieceManager, GameState } from "./global";
import { createBoard } from "./board/Board";

const defaultScene = createScene("main", 16, 16);
const cursor = createCursor();

scenes.addScene(defaultScene);
camera.snapTo(vec(0, -160));
// TODO: rethink the cursor... it shouldn't be added to the scenes grid as a child,
//  it needs to be more "global" than that and survive resets
defaultScene.addGameObject(cursor);

const piece1 = createPiece(
  `
o,x,o,
o,x,x
o,x,o
    `,
  vec(1, 0),
  Color.red()
);
const piece2 = createPiece(
  `
x,o,o,o
x,x,o,o
o,x,o,o
o,x,o,o
    `,
  vec(1, 1),
  Color.green()
);

const piece3 = createPiece(
  `
x,o,o,o
x,x,o,o
x,o,o,o
x,o,o,o
    `,
  vec(0, 1),
  Color.red()
);

const piece4 = createPiece(
  `
x,x,o
x,x,o
x,x,o
    `,
  vec(0, 1),
  Color.white()
);

const piece5 = createPiece(
  `
x,o,o,o
x,o,o,o
x,o,o,o
x,x,o,o
    `,
  vec(0, 2),
  Color.magenta()
);

const piece6 = createPiece(
  `
o,x,x,
o,x,o,
x,x,o,
    `,
  vec(1, 1),
  Color.green()
);

const piece7 = createPiece(
  `
x,o,o,
x,o,o,
x,x,x,
    `,
  vec(0, 1),
  Color.red()
);

const piece8 = createPiece(
  `
x,o,o
x,x,o
x,x,o
    `,
  vec(1, 1),
  Color.magenta()
);

startRuntime(
  async (scene) => {
    PieceManager.start(scene.grid);
    PieceManager.addPieceToGrid(piece1, vec(1, 12));
    PieceManager.addPieceToGrid(piece2, vec(5, 13));
    PieceManager.addPieceToGrid(piece3, vec(7, 13));
    PieceManager.addPieceToGrid(piece4, vec(10, 13));
    PieceManager.addPieceToGrid(piece5, vec(10, 9));
    PieceManager.addPieceToGrid(piece6, vec(7, 9));
    PieceManager.addPieceToGrid(piece7, vec(2, 9));
    PieceManager.addPieceToGrid(piece8, vec(5, 7));
    scene.addGameObject(createBoard(8, 8));
  },
  (delta) => {
    GameState.update();
  },
  () => {},
  () => {
    PieceManager.debug();
  }
);
