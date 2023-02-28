import { createScene } from "../engine/scenes/scene";
import { startRuntime } from "../engine/runtime";
import { vec } from "../engine/units/vec";
import { camera, scenes, sprites } from "../engine/global";
import { createCursor } from "./Cursor";
import { GameState, PieceManager } from "./global";
import { createBoard } from "./board/Board";
// @ts-ignore // TODO: cba
import * as sheet from "./resources/sprites.png";
import { pieceFactory, PieceName } from "./pieces/piece-factory";

const defaultScene = createScene("main", 16, 16);
const cursor = createCursor();

scenes.addScene(defaultScene);
camera.snapTo(vec(0, -260));
// TODO: rethink the cursor... it shouldn't be added to the scenes grid as a child,
//  it needs to be more "global" than that and survive resets
defaultScene.addGameObject(cursor);

startRuntime(
  async (scene) => {
    await sprites.loadSheet("puzzle", sheet);
    PieceManager.start(scene.grid);
    PieceManager.addPieceToGrid(pieceFactory.get(PieceName.C)!(), vec(3, 10));
    // PieceManager.addPieceToGrid(
    //   pieceFactory.get(PieceName.Lightning)!(),
    //   vec(6, 10)
    // );
    // PieceManager.addPieceToGrid(
    //   pieceFactory.get(PieceName.GolfClub)!(),
    //   vec(9, 10)
    // );
    // PieceManager.addPieceToGrid(
    //   pieceFactory.get(PieceName.LessThan)!(),
    //   vec(12, 10)
    // );
    // PieceManager.addPieceToGrid(
    //   pieceFactory.get(PieceName.Lamppost)!(),
    //   vec(12, 6)
    // );
    // PieceManager.addPieceToGrid(
    //   pieceFactory.get(PieceName.Brick)!(),
    //   vec(9, 6)
    // );
    // PieceManager.addPieceToGrid(pieceFactory.get(PieceName.Bolt)!(), vec(9, 3));
    // PieceManager.addPieceToGrid(pieceFactory.get(PieceName.L)!(), vec(12, 2));

    PieceManager.addBoardToGrid(
      createBoard(
        7,
        7,
        [vec(), vec(1, 0), vec(6, 0), vec(6, 1), vec(6, 2), vec(6, 3)],
        [vec(1, 2), vec(4, 4)]
      ),
      vec(4, 4)
    );
  },
  (delta) => {
    GameState.update();
  },
  () => {},
  () => {
    PieceManager.debug();
  }
);
