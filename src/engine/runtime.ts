import {
  camera,
  collision,
  debug,
  input,
  notifications,
  renderer,
  scenes,
  ui,
} from "./global";
import { DEBUG, FPS, PAUSE } from "./settings";
import { Scene } from "./scenes/scene";
// TODO (refactor): this is not engine code...
import { createCursor } from "./cursor";
import { vec } from "./units/vec";
import { PieceManager } from "../puzzle-a-day/global";

type StartFn = (scene: Scene) => void;
type UpdateFn = (delta: number) => void;
type DrawFn = () => void;
type DebugFn = () => void;

// TODO: debug code
const cursor = createCursor(vec());

export function startRuntime(
  start: StartFn,
  update: UpdateFn,
  draw: DrawFn,
  debug: DebugFn
): void {
  const r = new Runtime(start, update, draw, debug);
  void r.start();
}

class Runtime {
  private frame = 0;
  private lastFrame = 0;

  constructor(
    private gameStart: StartFn,
    private gameUpdate: UpdateFn,
    private gameDraw: DrawFn,
    private gameDebug: DebugFn
  ) {}

  public async start(): Promise<void> {
    const scene = scenes.start();
    input.start();
    (window as any).__scene = scene;
    (window as any).__pm = PieceManager;
    try {
      await this.gameStart(scene);
    } catch (err) {
      console.error("error starting game", err);
    }
    this.tick();
  }

  public tick(): void {
    // TODO: how expensive is this vs caching active scene in the runtime?
    const scene = scenes.getActiveScene();
    const start = Date.now();
    const delta = start - this.lastFrame;

    renderer.clear();

    // Updates
    input.update();
    ui.update(delta);
    scene.update(delta);
    // TODO: debug code
    cursor.update();
    notifications.update();
    camera.update(delta);
    this.gameUpdate(delta);

    // Draw
    scene.draw();
    notifications.draw();
    ui.draw();
    this.gameDraw();

    // Debug
    scene.debug();
    input.debug();
    collision.debug();
    this.gameDebug();

    // Camera
    camera.draw();
    camera.debug();

    const duration = Date.now() - start;
    const remainingDelta = 1000 / FPS - duration;

    if (DEBUG) {
      this.debug(delta, remainingDelta);
      debug.draw();
    }

    if (!PAUSE) {
      this.lastFrame = start;
      setTimeout(this.tick.bind(this), remainingDelta);
    }
  }

  public debug(delta: number, remaining: number): void {
    debug.sample("FPS AVG", delta, FPS, (value) => {
      return (1000 / value).toFixed(2);
    });
    debug.sample("FRAME HEADROOM", remaining, FPS, (value) => {
      return value.toFixed(2) + "ms";
    });
    debug.print("FRAME", ++this.frame);
  }
}
