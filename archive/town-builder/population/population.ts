import { createVillager, Villager } from "./villager";
import { events } from "../../../src/engine/global";
import { DayTickEventPayload, Events } from "../events/events";
import { Handler } from "../../../src/engine/events/EventManager";
import { economy } from "../global";
import { Resource } from "../economy/economy";
import { Building } from "../construction/building";
import { vec } from "../../engine/vec";
import { DisplayObject } from "../../../src/engine/objects/displayObject";

export function createPopulation(): Population {
  return new Population();
}

export class Population extends DisplayObject {
  private villagers: Set<Villager> = new Set();

  private readonly EODHandler: Handler;

  constructor() {
    super(0, vec());
    this.EODHandler = this.handleEOD.bind(this);
  }

  public getName(): string {
    return "population";
  }

  private handleEOD(payload: DayTickEventPayload): void {
    let food = economy.withdraw(
      Resource.Food,
      this.getPopulationCount() * Villager.HungerPerDay
    );

    for (const v of this.villagers) {
      food = v.feed(food);

      if (v.shouldKill()) {
        this.killVillager(v);
      } else {
        v.increaseAgeDays(payload.after - payload.before);
      }
    }
  }

  private killVillager(villager: Villager): void {
    this.villagers.delete(villager);
    villager.unassign();
  }

  public start(): void {
    events.listen(Events.DayTick, this.EODHandler);
  }

  public update(delta: number): void {
    for (const v of this.villagers) {
      v.update(delta);
    }
  }

  public getPopulationCount(): number {
    return this.villagers.size;
  }

  public getAvailableWorkers(): number {
    let t = 0;
    this.villagers.forEach((v) => {
      if (v.isAvailableForAssignment()) {
        t++;
      }
    });
    return t;
  }

  public assignWorkers(building: Building, workers: number): void {
    // TODO (optimise): maybe don't use set if we keep having to create a new array to create new arrays (filter)
    const available = [...this.villagers].filter((v) =>
      v.isAvailableForAssignment()
    );
    for (const v of available.slice(0, workers)) {
      v.assignForWork(building);
      building.assign(v);
    }
  }

  public assignVillagers(building: Building, villagers: number): void {
    const available = [...this.villagers].filter((v) => v.isHomeless());
    for (const v of available.slice(0, villagers)) {
      v.assignToHome(building);
      building.assign(v);
    }
  }

  public addPopulation(n: number): void {
    for (let i = 0; i < n; i++) {
      const pos = vec();
      const v = createVillager(pos);
      this.add(v, pos);
      this.villagers.add(v);
    }
  }
}
