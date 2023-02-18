import { createPathFinder } from "../engine/pathfinder";
import { createUIManager } from "../../src/engine/ui/ui";
import { GRID_HEIGHT, GRID_WIDTH } from "../../src/engine/settings";
import { createLevelManager } from "./levels/levelManager";

export const ui = createUIManager();
export const path = createPathFinder(GRID_WIDTH, GRID_HEIGHT);
export const levelManager = createLevelManager();
