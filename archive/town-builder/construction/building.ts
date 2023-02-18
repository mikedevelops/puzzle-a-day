import { Vec, vec } from "../../engine/vec";
import { notifications, renderer } from "../../../src/engine/global";
import { Color } from "../../../src/engine/color";
import { State } from "../../../src/engine/stateMachine";
import { Villager } from "../population/villager";
import { PLACEMENT_ALPHA, population } from "../global";
import { Resource } from "../economy/economy";
import {
  CONSTRUCTION_STATE,
  HOUSE_IDLE_STATE,
  IDLE_STATE,
  PRODUCER_STATE,
} from "./state/state";
import { SpriteObject } from "../../../src/engine/objects/spriteObject";
import { DEBUG_LAYER } from "../../../src/engine/renderer/renderer";
import { ConstructionType } from "./construction";

let id = 0;

export interface Producer {
  discriminator: "Producer";
  getProductionInterval(): number;
  getResourceType(): Resource;
  produce(): number;
  isEnabled(): boolean;
}

export function isProducer(building: any): building is Producer {
  return building.discriminator === "Producer";
}

export abstract class Building extends SpriteObject {
  private workers: Set<Villager> = new Set();
  public temp = false;

  constructor(
    sprite: string,
    spriteOffset: Vec,
    public type: ConstructionType,
    private minWorkers: number
  ) {
    super(id++, vec(), sprite, spriteOffset);
  }

  public abstract getIdleState(): State;

  public update(delta: number): void {
    if (this.temp) {
      return;
    }
    super.update(delta);
  }

  public draw() {
    super.draw(this.temp ? PLACEMENT_ALPHA : 1);
  }

  public assign(villager: Villager): void {
    if (this.workers.size >= this.minWorkers) {
      // TODO (refactor): do something more meaningful here than a no-op
      console.warn("over assigned workers!");
      return;
    }

    this.workers.add(villager);
  }

  public unassign(villager: Villager): void {
    if (!this.workers.has(villager)) {
      throw new Error(
        `Cannot unassign villager ${villager.id}, was not assigned`
      );
    }

    notifications.createNotification({
      content: `Villager ${
        villager.id
      } was unassigned to the ${this.getName()}`,
    });
    this.workers.delete(villager);

    if (this.workers.size < this.minWorkers) {
      population.assignWorkers(this, 1);
    }
  }

  private getColor(): Color {
    if (!this.isEnabled()) {
      return Color.red(0.5);
    }

    switch (this.getState()) {
      case CONSTRUCTION_STATE:
        return Color.magenta(0.5);
      case PRODUCER_STATE:
        return Color.green(0.5);
      case IDLE_STATE:
      case HOUSE_IDLE_STATE:
        return Color.white(0.5);
      default:
        throw new Error("nope");
    }
  }

  public getName(): string {
    return `${id}_building_${this.type}`;
  }

  public debug(): void {
    console.log("debug");
    renderer.fillText(
      this.stateMachine?.getActiveState().getName() ?? "?",
      this.getWorldPos(),
      Color.green(),
      600,
      DEBUG_LAYER
    );
  }
}
