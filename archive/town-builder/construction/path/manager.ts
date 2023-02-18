import { Vec, vec } from "../../../engine/vec";
import { DisplayObject } from "../../../../src/engine/objects/displayObject";
import { debug, renderer } from "../../../../src/engine/global";
import { DEBUG_PATHS, GRID_UNIT } from "../../../../src/engine/settings";
import { Color } from "../../../../src/engine/color";
import { createPath, Path } from "./path";
import { DEBUG_LAYER } from "../../../../src/engine/renderer/renderer";

type AdjacentPaths = Set<Set<Path>>;

export function createPathManager(): PathManager {
  return new PathManager(0, vec());
}

class PathManager extends DisplayObject {
  private paths: AdjacentPaths = new Set();

  public start(): void {
    // TODO: initialise pathfinding, i.e. build path nodes from this.getGrid()
  }

  public getName(): string {
    return "path_manager";
  }

  public addPath(path: Path): void {
    const adjacentPaths = new Set<Set<Path>>();
    for (const existingPaths of this.paths) {
      for (const existingPath of existingPaths) {
        if (this.isAdjacent(path, existingPath)) {
          adjacentPaths.add(existingPaths);
        }
      }
    }

    if (!adjacentPaths.size) {
      this.paths.add(new Set([path]));
      return;
    }

    this.joinPaths(adjacentPaths, path);
  }

  public removePath(path: Path): void {}

  private joinPaths(paths: AdjacentPaths, path: Path): void {
    const newPath = new Set<Path>();

    for (const adjacentPath of paths) {
      for (const adjacentNode of adjacentPath) {
        newPath.add(adjacentNode);
      }
      this.paths.delete(adjacentPath);
    }

    newPath.add(path);
    this.paths.add(newPath);
  }

  private isAdjacent(a: Path, b: Path): boolean {
    const grid = this.getGrid();
    const aPos = grid.worldToLocalSnap(a.pos);
    const bPos = grid.worldToLocalSnap(b.pos);

    if (!aPos || !bPos) {
      return false;
    }

    if (aPos.local.x !== bPos.local.x && aPos.local.y !== bPos.local.y) {
      return false;
    }

    if (aPos.local.distance(bPos.local) === 1) {
      return true;
    }

    return false;
  }

  public draw(): void {}

  public debug(): void {
    debug.print("paths", this.paths.size);

    if (DEBUG_PATHS) {
      for (const path of this.paths) {
        for (const p of path) {
          // TODO: well this function signature is awful
          renderer.drawISoRect(
            p.pos,
            GRID_UNIT,
            GRID_UNIT,
            Color.magenta(0.5),
            true,
            vec(),
            4,
            DEBUG_LAYER
          );
        }
      }
    }
  }
}
