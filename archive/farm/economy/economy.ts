import { debug, renderer } from "../../../src/engine/global";
import { vec } from "../../engine/vec";
import { Color } from "../../../src/engine/color";
import { UI_LAYER } from "../../../src/engine/renderer/renderer";
import { GrowType } from "../entities/growNode/GrowNode";

export function createEconomy(): Economy {
  return new Economy();
}

class Economy {
  private total = 0;
  private inventory = new Map<GrowType, number>();

  public addCurrency(value: number): void {
    this.total += value;
  }

  public addInventory(type: GrowType, n: number): void {
    const i = this.inventory.get(type);
    let total = n;
    if (i) {
      total = i + n;
    }
    this.inventory.set(type, total);
  }

  public buy(type: GrowType, price: number, n: number): boolean {
    const i = this.inventory.get(type);
    if (i === undefined) {
      throw new Error(`Cannot buy ${type}, not in inventory!`);
    }

    // take from inventory
    if (i >= n) {
      console.log("subtract", n, "from inventory: ", i);
      this.inventory.set(type, i - n);
      return true;
    }

    // take from cash
    if (this.total >= price * n) {
      this.total -= price * n;
      console.log("subtract", price * n, "from total: ", this.total);
      return true;
    }

    return false;
  }

  public debug(): void {
    debug.print("$", this.total);
  }

  public draw(): void {
    const { stage } = renderer;
    renderer.fillText(
      `$${this.total.toFixed(2)}`,
      vec(stage.width - 128, 32),
      Color.white(),
      UI_LAYER
    );

    for (const [type, total] of this.inventory) {
      renderer.fillText(
        `${type} ${total}`,
        vec(stage.width - 128, 48),
        Color.white(),
        UI_LAYER
      );
    }
  }
}
