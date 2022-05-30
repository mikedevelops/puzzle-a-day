import { createDebugger } from "../engine/debugger";
import { createGrid } from "../engine/grid";
import { vec } from "../engine/vec";
import { GRID_HEIGHT, GRID_WIDTH } from "../engine/settings";
import { createInputManager } from "../engine/input";
import { createRenderer } from "../engine/renderer";
import { createCamera } from "../engine/camera";
import { createSpriteManager } from "../engine/sprites";
import { createCollisionManager } from "../engine/collision";
import { createLogger } from "../engine/logger";

export const grid = createGrid(GRID_WIDTH, GRID_HEIGHT, vec());
export const sprites = createSpriteManager();
export const renderer = createRenderer();
export const camera = createCamera(renderer);
export const debug = createDebugger(renderer.ctx);
export const input = createInputManager(renderer.canvas, camera);
export const collision = createCollisionManager();
export const logger = createLogger();
