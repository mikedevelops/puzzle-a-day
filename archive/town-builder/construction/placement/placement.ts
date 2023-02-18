import { SpriteObject } from "../../../../src/engine/objects/spriteObject";
import { Vec, vec } from "../../../engine/vec";
import {
  createPathFinding,
  PathFinder,
} from "../../../../src/engine/pathFinding/aStar";
import { Grid } from "../../../../src/engine/grid";
import { Construction, ConstructionType } from "../construction";
import { ConstructionManager } from "../construction-manager";
import { Path } from "../path/path";
import { construction } from "../../global";
import { input } from "../../../../src/engine/global";

export function createPlacement(): Placement {
  return new Placement(0, vec(), "");
}

export interface PlacementCmd {
  type: ConstructionType;
  confirmed: boolean;
  pos: Vec;
}

class Placement extends SpriteObject {
  private type: ConstructionType | null = null;
  private pathFinder: PathFinder | null = null;

  private activeConstruction: Construction | null = null;
  private pathStart: Vec | null = null;
  private lastPath: [Vec, Vec] = [vec(), vec()];
  private tempPath: Set<Construction> = new Set();

  public init(grid: Grid) {
    this.pathFinder = createPathFinding(grid.getPathFindingGrid());
  }

  private getPathFinder(): PathFinder {
    if (this.pathFinder === null) {
      throw new Error(
        "Cannot access path finder before it has been initialised"
      );
    }
    return this.pathFinder;
  }

  public isEnabled(): boolean {
    return this.sprite !== "" && this.enabled;
  }

  public getName(): string {
    return "placement";
  }

  // TODO: update function gets pointer position, this should be consistent
  public place(posLocal: Vec): void {
    const c = this.activeConstruction;
    if (!c) {
      return;
    }

    if (c instanceof Path) {
      if (!this.pathStart) {
        construction.addConstruction(c, posLocal);
        this.tempPath.add(c);
        this.enable(ConstructionType.Path, true);
        this.pathStart = posLocal;
      } else {
        this.clearTempPath();
        this.createPathTo(posLocal, false).forEach((path) => {
          construction.addConstruction(path, path.pos);
        });
        this.pathStart = null;
      }
    }
  }

  private shouldRecalcPath(start: Vec, end: Vec): boolean {
    if (this.lastPath.length !== 2) {
      return true;
    }
    return !this.lastPath[0].equalsv(start) || !this.lastPath[1].equalsv(end);
  }

  public update(delta: number): void {
    const c = this.activeConstruction;
    if (!c) {
      return;
    }

    const pos = this.getGrid().worldToLocalSnap(input.pointer.getWorldPos());
    if (!pos) {
      return;
    }

    if (
      c instanceof Path &&
      this.pathStart &&
      this.shouldRecalcPath(this.pathStart, pos.local)
    ) {
      this.clearTempPath();
      this.createPathTo(pos.local, true).forEach((path) => {
        construction.addConstruction(path, path.pos);
        this.tempPath.add(path);
      });
    }
  }

  private clearTempPath(): void {
    for (const c of this.tempPath) {
      construction.removeConstruction(c);
    }
    this.tempPath.clear();
  }

  private createPathTo(end: Vec, blueprint: boolean): Path[] {
    if (!this.pathStart) {
      throw new Error("Cannot create path, no path start defined");
    }

    const path = this.getPathFinder().pathTo(this.pathStart, end);
    this.lastPath = [this.pathStart, end];
    return path.map((p) => {
      return ConstructionManager.CreateConstructionByType(
        ConstructionType.Path,
        blueprint,
        p
      );
    });
  }

  public disable(): void {
    this.children.clear();
    this.activeConstruction = null;
  }

  public enable(type: ConstructionType, blueprint: boolean): void {
    this.type = type;
    switch (type) {
      // case ConstructionType.Farm:
      //   this.sprite = Farm.getSprite();
      //   this.offset = Farm.getSpriteOffset();
      //   break;
      // case ConstructionType.House:
      //   this.sprite = House.getSprite();
      //   this.offset = House.getSpriteOffset();
      //   break;
      // case ConstructionType.Sawmill:
      //   this.sprite = Sawmill.getSprite();
      //   this.offset = Sawmill.getSpriteOffset();
      //   break;
      case ConstructionType.Path: {
        const construction = ConstructionManager.CreateConstructionByType(
          ConstructionType.Path,
          blueprint
        );
        this.setChildren(construction);
        this.activeConstruction = construction;
        break;
      }
    }
  }

  public shouldPlaceTempPath(): boolean {
    return this.pathStart !== null && this.type === ConstructionType.Path;
  }
}
