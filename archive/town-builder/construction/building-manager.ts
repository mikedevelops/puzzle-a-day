import { Vec, vec } from "../../engine/vec";
import { DisplayObject } from "../../../src/engine/objects/displayObject";
import { Rect } from "../../engine/rect";
import { debug, input, renderer } from "../../../src/engine/global";
import { Color } from "../../../src/engine/color";
import {
  BACKGROUND_LAYER,
  DEBUG_LAYER,
  UI_LAYER,
} from "../../../src/engine/renderer/renderer";
import { Building } from "./building";
import { createFarm, FARM_MIN_WORKERS } from "./farm/farm";
import { economy, population } from "../global";
import { createHouse, HOUSE_MIN_WORKERS } from "./house/house";
import { getPurchaseOrder } from "../config/balance";
import { getArea, getOutlineIso } from "../config/placement";
import { KeyInput, PointerState } from "../../../src/engine/input/input";
import { SPRITE_SCALE, SPRITE_SIZE } from "../../../src/engine/settings";
import { createSawmill, SAWMILL_MIN_WORKERS } from "./wood/sawmill";
import { ConstructionType } from "./construction";

export enum BuildingMode {
  Idle,
  Placement,
}

type Area = Vec[];

export function createBuildingManager(): BuildingManager {
  return new BuildingManager(1, vec());
}

export class BuildingManager extends DisplayObject {
  private mode = BuildingMode.Placement;
  private type = ConstructionType.Farm;

  private buildings: Building[][] = [];

  public setType(type: ConstructionType): void {
    this.type = type;
  }

  public getName(): string {
    return "building_manger";
  }

  private addBuilding(building: Building, pos: Vec): void {
    const area = getArea(building.type).map((v) => v.addv(pos));

    console.log(area);

    for (const p of area) {
      if (!this.canPlacePoint(p)) {
        throw new Error(`Cannot place building at ${p}, occupied`);
      }

      if (!this.buildings[p.x]) {
        this.buildings[p.x] = [];
      }

      this.buildings[p.x][p.y] = building;
    }

    this.add(building, this.getGrid().localToWorld(pos));
  }

  private canPlaceBuilding(pos: Vec): boolean {
    // const area = this.getArea(pos, getOutline(this.type));
    // for (const p of area) {
    //   if (!this.canPlacePoint(p)) {
    //     return false;
    //   }
    // }
    return true;
  }

  private canPlacePoint(pos: Vec): boolean {
    if (
      this.buildings[pos.x]?.length &&
      this.buildings[pos.x][pos.y] instanceof Building
    ) {
      return false;
    }
    return true;
  }

  public update(delta: number): void {
    // super.update(delta);
    //
    // switch (input.getKeyDownThisFrame()) {
    //   case KeyInput.FarmPlacementMode:
    //     this.type = BuildingType.Farm;
    //     break;
    //   case KeyInput.HousePlacementMode:
    //     this.type = BuildingType.House;
    //     break;
    //   case KeyInput.SawmillPlacementMode:
    //     this.type = BuildingType.Sawmill;
    //     break;
    // }
    //
    // const pos = this.getPointerGridPosition(input.pointer.getWorldPos());
    //
    // if (
    //   pos &&
    //   input.isPointerDownThisFrame() &&
    //   input.pointer.state === PointerState.Primary &&
    //   this.canPlaceBuilding(pos)
    // ) {
    //   if (this.canAffordBuilding(this.type)) {
    //     const building = this.createNewBuilding(this.type);
    //     this.buyBuilding(building);
    //     this.addBuilding(building, pos);
    //   }
    // }
  }

  public spawnBuilding(type: ConstructionType, pos: Vec): Building {
    const building = this.createNewBuilding(type);
    this.buyBuilding(building);
    this.addBuilding(building, pos);
    return building;
  }

  private canAffordBuilding(type: ConstructionType): boolean {
    const resources = economy.canFulfilPurchase(getPurchaseOrder(type));
    const workers =
      population.getAvailableWorkers() >= this.getWorkerCost(type);
    return workers && resources;
  }

  private getWorkerCost(type: ConstructionType): number {
    switch (type) {
      case ConstructionType.Farm:
        return FARM_MIN_WORKERS;
      case ConstructionType.House:
        return HOUSE_MIN_WORKERS;
      case ConstructionType.Sawmill:
        return SAWMILL_MIN_WORKERS;
      default:
        throw new Error(`Cannot get worker cost for type ${this.type}`);
    }
  }

  private buyBuilding(building: Building): void {
    switch (building.type) {
      case ConstructionType.Farm: {
        economy.fulfillPurchase(getPurchaseOrder(building.type));
        population.assignWorkers(building, this.getWorkerCost(building.type));
        return;
      }
      case ConstructionType.House: {
        economy.fulfillPurchase(getPurchaseOrder(building.type));
        population.assignVillagers(building, 4);
        return;
      }
      case ConstructionType.Sawmill: {
        economy.fulfillPurchase(getPurchaseOrder(building.type));
        population.assignVillagers(building, this.getWorkerCost(building.type));
        return;
      }
      default:
        throw new Error(`Cannot buy building with type ${this.type}`);
    }
  }

  private createNewBuilding(type: ConstructionType): Building {
    switch (type) {
      case ConstructionType.Farm:
        return createFarm();
      case ConstructionType.House:
        return createHouse();
      case ConstructionType.Sawmill:
        return createSawmill();
      // case BuildingType.Warehouse:
      //   return createSawmill();
      default:
        throw new Error(`Cannot create building with type ${this.type}`);
    }
  }

  private getPointerGridPosition(pos: Vec): Vec | null {
    const snap = this.getGrid().worldToLocalSnap(pos);
    if (!snap) {
      return null;
    }
    return snap.local;
  }

  public draw(): void {
    super.draw();
    const pos = input.pointer.getWorldPos();
    const snap = this.getGrid().worldToLocalSnap(pos);

    if (!snap) {
      return;
    }

    const placement = getOutlineIso(this.type).map((p) =>
      p.multiply(this.getGrid().size).addv(snap.world)
    );

    // const worldPlacement = placement
    //   .multiply((SPRITE_SIZE * SPRITE_SCALE) / 2)
    //   .addv(snap.world);
    // const worldPlacement = snap;

    const cost = getPurchaseOrder(this.type);
    renderer.fillText(
      `${this.type} ${JSON.stringify(cost)}`,
      input.pointer.getScreenPos(),
      Color.white(),
      600,
      UI_LAYER
    );
    renderer.path(
      placement,
      this.canPlaceBuilding(snap.local) && this.canAffordBuilding(this.type)
        ? Color.green()
        : Color.red(),
      4,
      UI_LAYER
    );
  }

  public debug() {
    super.debug();
    const grid = this.getGrid();
    // const area = this.getArea(
    //   input.pointer.getWorldPos(),
    //   getOutline(this.type)
    // ).map((p) => grid.vecToWorld(p));

    debug.print("placement", this.type);

    for (let x = 0; x < this.buildings.length; x++) {
      if (this.buildings[x]) {
        for (let y = 0; y < this.buildings[x].length; y++) {
          if (this.buildings[x][y] instanceof Building) {
            renderer.drawISoRect(
              grid.localToWorld(vec(x, y)),
              grid.size,
              grid.size,
              Color.green(),
              false,
              vec(),
              4,
              DEBUG_LAYER
            );
          }
        }
      }
    }
  }

  private getArea(pos: Vec, rect: Rect): Area {
    const area: Area = [];
    if (
      (rect.width > 1 && rect.width % 2 !== 0) ||
      (rect.height > 1 && rect.height % 2 !== 0)
    ) {
      throw new Error(`odd rects not yet supported!`);
    }

    if (rect.width === 1 && rect.height === 1) {
      return [pos];
    }

    // for (let y = -rect.height / 2; y < rect.height / 2; y++) {
    //   for (let x = -rect.width / 2; x < rect.width / 2; x++) {
    //     const p = pos.sub(x, y);
    //     area.push(p);
    //   }
    // }

    for (let y = 0; y < rect.height; y++) {
      for (let x = 0; x < rect.width; x++) {
        const p = pos.sub(x, y);
        area.push(p);
      }
    }

    return area;
  }

  public fill(type: ConstructionType): void {
    const grid = this.getGrid();

    grid.forEach((node) => {
      this.addBuilding(this.createNewBuilding(type), node.local);
    });
  }
}
