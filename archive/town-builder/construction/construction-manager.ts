import { GameObject } from "../../../src/engine/objects/gameObject";
import { Vec, vec } from "../../engine/vec";
import { Construction, ConstructionType } from "./construction";
import { getArea } from "../config/placement";
import { createPath } from "./path/path";

export function createConstructionManager(): ConstructionManager {
  return new ConstructionManager();
}

type ConstructionMatrix = (Construction | null)[][];

export class ConstructionManager extends GameObject {
  private constructionMatrix: ConstructionMatrix = [];
  private construction: Map<Construction, Vec[]> = new Map();

  public static CreateConstructionByType(
    type: ConstructionType,
    blueprint: boolean,
    pos = vec()
  ): Construction {
    switch (type) {
      case ConstructionType.Path:
        return createPath(blueprint, pos);
      default:
        throw new Error(`Construction not supported ${type}`);
    }
  }

  constructor() {
    super(0, vec());
  }

  public getConstructionMatrix(): ConstructionMatrix {
    return this.constructionMatrix;
  }

  public start(): void {
    const grid = this.getGrid();
    grid.forEach((node) => {
      if (!this.constructionMatrix[node.local.x]) {
        this.constructionMatrix[node.local.x] = [];
      }
      if (!this.constructionMatrix[node.local.x][node.local.y]) {
        this.constructionMatrix[node.local.x][node.local.y] = null;
      }
    });
  }

  private isInBounds(localPos: Vec): boolean {
    return !(
      localPos.x >= this.constructionMatrix.length ||
      this.constructionMatrix[localPos.x][localPos.y] === undefined
    );
  }

  private canPlaceAt(localPos: Vec): boolean {
    return this.isInBounds(localPos);
  }

  private getConstructionAt(localPos: Vec): Construction | null {
    if (!this.isInBounds(localPos)) {
      return null;
    }

    return this.constructionMatrix[localPos.x][localPos.y];
  }

  public addConstruction(
    construction: Construction,
    localPos: Vec,
    replace = false
  ): void {
    const area = getArea(construction.type).map((p) => p.addv(localPos));
    for (const p of area) {
      if (!this.isInBounds(p)) {
        return;
      }

      const conflict = this.getConstructionAt(p);
      if (!replace && conflict !== null) {
        return;
      }
    }

    for (const p of area) {
      this.constructionMatrix[p.x][p.y] = construction;
    }

    const grid = this.getGrid();
    this.add(construction, grid.localToWorld(localPos));
    this.construction.set(construction, area);
  }

  public removeConstruction(construction: Construction): void {
    const area = this.construction.get(construction);
    if (!area) {
      return;
    }
    for (const p of area) {
      this.constructionMatrix[p.x][p.y] = null;
    }
    this.construction.delete(construction);
    this.remove(construction);
  }

  public getName(): string {
    return "construction_manager";
  }
}
