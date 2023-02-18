import { renderer } from "../../../src/engine/global";
import { vec } from "../../engine/vec";
import { Color } from "../../../src/engine/color";
import { UI_LAYER } from "../../../src/engine/renderer/renderer";
import { Population } from "../population/population";
import { population } from "../global";
import { PurchaseOrder } from "../config/balance";

export enum Resource {
  Food = "food",
  Gold = "gold",
  Wood = "wood",
  Workers = "workers",
}

type ResourceInventory = Map<Resource, number>;

// TODO (refactor): should population be part of the economy? it makes it easier for printing atm, but that's it
export function createEconomy(): Economy {
  return new Economy();
}

class Economy {
  private total = 0;
  private inventory: ResourceInventory;

  constructor() {
    this.inventory = new Map<Resource, number>(
      Object.entries(Resource).map(([_, v]) => [v, 0])
    );
  }

  public addCurrency(value: number): void {
    this.total += value;
  }

  public addResource(type: Resource, n: number): void {
    const i = this.inventory.get(type);
    let total = n;
    if (i) {
      total = i + n;
    }
    this.inventory.set(type, total);
  }

  public buy(type: Resource, price: number, n: number): boolean {
    const i = this.inventory.get(type);
    if (i === undefined) {
      throw new Error(`Cannot buy ${type}, not in inventory!`);
    }

    // take from inventory
    if (i >= n) {
      this.inventory.set(type, i - n);
      return true;
    }

    // take from cash
    if (this.total >= price * n) {
      this.total -= price * n;
      return true;
    }

    return false;
  }

  public withdraw(type: Resource, amount?: number): number {
    const r = this.inventory.get(type);

    // TODO (refactor): should this be a valid case? Requesting an item that does not exist in the inventory
    if (r === undefined) {
      return 0;
    }

    // return total resource if no amount specified or we do not have enough
    if (amount === undefined || r < amount) {
      this.inventory.set(type, 0);
      return r;
    }

    this.inventory.set(type, r - amount);
    return amount;
  }

  public fulfillPurchase(po: PurchaseOrder): boolean {
    if (!this.canFulfilPurchase(po)) {
      return false;
    }

    for (const p of po) {
      const resource = this.inventory.get(p.type)!;
      this.inventory.set(p.type, resource - p.amount);
    }

    return true;
  }

  public canFulfilPurchase(po: PurchaseOrder): boolean {
    for (const p of po) {
      const resource = this.inventory.get(p.type);
      if (!resource || resource < p.amount) {
        return false;
      }
    }

    return true;
  }

  public debug(): void {}

  public draw(): void {
    let y = 32;
    this.printResource(`Population: ${population.getPopulationCount()}`, y);
    y += 16;
    this.printResource(`Workers: ${population.getAvailableWorkers()}`, y);
    Object.entries(Resource).forEach(([_, r]) => {
      y += 16;
      this.printResource(`${r}: ${this.inventory.get(r)}`, y);
    });
  }

  private printResource(str: string, y: number): void {
    const m = renderer.ctx.measureText(str);
    const x = renderer.stage.width - m.width - 32;
    renderer.fillText(
      str,
      vec(x, y),
      Color.white(),
      renderer.stage.width,
      UI_LAYER
    );
  }
}
