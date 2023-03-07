import { createScene } from "../engine/scenes/scene";
import { startRuntime } from "../engine/runtime";
import { Direction, Vec, vec } from "../engine/units/vec";
import { camera, scenes, sprites } from "../engine/global";
import { createCursor } from "./Cursor";
import { GameState, PieceManager } from "./global";
// @ts-ignore // TODO: cba
import * as sheet from "./resources/sprites.png";
// @ts-ignore // TODO: cba
import * as sheetData from "./resources/sprites.json";
import { pieceFactory, PieceName } from "./pieces/piece-factory";
import { createBoard } from "./board/Board";

const defaultScene = createScene("main", 16, 16);
const cursor = createCursor();

scenes.addScene(defaultScene);
camera.snapTo(vec(0, -260));
// TODO: rethink the cursor... it shouldn't be added to the scenes grid as a child,
//  it needs to be more "global" than that and survive resets
defaultScene.addGameObject(cursor);

startRuntime(
  async (scene) => {
    await sprites.loadSheet("puzzle", sheet, sheetData);
    PieceManager.start(scene.grid);
    // PieceManager.addPieceToGrid(
    //   pieceFactory.get(PieceName.C)!(vec(), Direction.North),
    //   vec(2, 11)
    // );
    PieceManager.addPieceToGrid(
      pieceFactory.get(PieceName.Lightning)!(vec(), Direction.North),
      vec(5, 11)
    );
    // PieceManager.addPieceToGrid(
    //   pieceFactory.get(PieceName.GolfClub)!(vec(), Direction.North),
    //   vec(8, 12)
    // );
    // PieceManager.addPieceToGid(
    //   pieceFactory.get(PieceName.LessThan)!(vec(), Direction.North),
    //   vec(11, 12)
    // );
    // PieceManager.addPieceToGrid(
    //   pieceFactory.get(PieceName.Lamppost)!(vec(), Direction.East),
    //   vec(13, 9)
    // );
    // PieceManager.addPieceToGrid(
    //   pieceFactory.get(PieceName.Brick)!(vec(), Direction.East),
    //   vec(10, 7)
    // );
    // PieceManager.addPieceToGrid(
    //   pieceFactory.get(PieceName.Bolt)!(vec(), Direction.East),
    //   vec(10, 2)
    // );
    PieceManager.addPieceToGrid(
      pieceFactory.get(PieceName.L)!(vec(), Direction.North),
      vec(4, 4)
    );

    for (const p of PieceManager.getPieces()) {
      p.rotate();
      p.rotate();
      p.rotate();
      p.rotate();
      window.addEventListener("keydown", (event) => {
        if (event.key === "r") {
          p.rotate();
        }
      });
    }
    //
    // scene.addUIObject(
    //   createCalendar(renderer.stage.width, GRID_UNIT * 3, new Date()),
    //   vec(0, renderer.stage.height - GRID_UNIT * 3)
    // );
    //
    // PieceManager.addBoardToGrid(
    //   createBoard(
    //     7,
    //     7,
    //     [vec(), vec(1, 0), vec(6, 0), vec(6, 1), vec(6, 2), vec(6, 3)],
    //     [vec(1, 2), vec(4, 4)]
    //   ),
    //   vec(2, 2)
    // );
  },
  (delta) => {
    GameState.update();
  },
  () => {},
  () => {
    PieceManager.debug();
  }
);
