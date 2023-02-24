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
    PieceManager.addPieceToGrid(pieceFactory.get(PieceName.Tee)!(), vec(6, 10));
    // PieceManager.addPieceToGrid(piece2, vec(5, 13));
    // PieceManager.addPieceToGrid(piece3, vec(7, 13));
    // PieceManager.addPieceToGrid(piece4, vec(10, 13));
    // PieceManager.addPieceToGrid(piece5, vec(10, 9));
    // PieceManager.addPieceToGrid(piece6, vec(7, 9));
    // PieceManager.addPieceToGrid(piece7, vec(2, 9));
    // PieceManager.addPieceToGrid(piece8, vec(5, 6));
    // scene.addGameObject(createBoard(8, 8));
  },
  (delta) => {
    GameState.update();
  },
  () => {},
  () => {
    PieceManager.debug();
  }
);
