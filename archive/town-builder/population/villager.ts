import { clamp, randInt } from "../../../src/engine/maths";
import { notifications, renderer } from "../../../src/engine/global";
import { Building } from "../construction/building";
import { createStateMachine, StateMachine } from "../../../src/engine/stateMachine";
import { VillagerIdleState } from "./state/VillagerIdleState";
import { vec, Vec } from "../../engine/vec";
import { DisplayObject } from "../../../src/engine/objects/displayObject";
import { Color } from "../../../src/engine/color";
import { VILLAGER_LAYER } from "../../../src/engine/renderer/renderer";

export function createVillager(pos: Vec): Villager {
  const v = new Villager(pos);
  const sm = createStateMachine(new VillagerIdleState(v));
  v.stateMachine = sm;
  return v;
}

let id = 0;

function getId(): number {
  id++;
  return id;
}

const LifeSpanDaysBase = Infinity;
const MaxHungerDays = Infinity;

export class Villager extends DisplayObject {
  public static HungerPerDay = 5;
  public age = 0;

  private daysWithoutFood = 0;
  private assignment: Building | null = null;
  private home: Building | null = null;

  public isHome = false;
  public isAtAssignment = false;

  constructor(
    pos: Vec,
    public id = getId(),
    public lifeSpan = randInt(LifeSpanDaysBase, LifeSpanDaysBase * 0.25),
    public maxHungerDays = randInt(MaxHungerDays, MaxHungerDays * 0.33)
  ) {
    console.log("created villager", id);
    super(id, pos);
  }

  public isAvailableForAssignment(): boolean {
    return this.assignment === null;
  }

  public isHomeless(): boolean {
    return this.home === null;
  }

  public getHome(): Building | null {
    return this.home;
  }

  public getAssignment(): Building | null {
    return this.assignment;
  }

  public assignForWork(building: Building): void {
    notifications.createNotification({
      content: `Villager ${this.id} was assigned to the ${building.getName()}`,
    });
    this.assignment = building;
  }

  public assignToHome(building: Building): void {
    notifications.createNotification({
      content: `Villager ${this.id} was assigned to the ${building.getName()}`,
    });
    this.home = building;
    this.pos = building.pos.clone();
  }

  public unassign(): void {
    this.assignment?.unassign(this);
  }

  public increaseAgeDays(days: number): void {
    this.age += days;
  }

  // TODO (refactor): this should happen once per day, but it's not intuitive from reading this
  // returns remaining food
  public feed(food: number): number {
    if (food >= Villager.HungerPerDay) {
      this.daysWithoutFood = 0;
    } else {
      this.daysWithoutFood++;
    }

    return clamp(food - Villager.HungerPerDay, 0, Infinity);
  }

  public shouldKill(): boolean {
    if (this.daysWithoutFood > this.maxHungerDays) {
      notifications.createNotification({
        content: `Villager ${this.id} died aged ${this.age} due to hunger`,
      });
      return true;
    }

    if (this.age > this.lifeSpan) {
      notifications.createNotification({
        content: `Villager ${this.id} died aged ${this.age} due to natural causes`,
      });
      return true;
    }

    return false;
  }

  public update(delta: number): void {
    this.stateMachine?.update(delta);
  }

  public draw(): void {
    // const pos = this.getWorldPos();
    //
    // renderer.fillRect(
    //   pos.add(0, -20),
    //   10,
    //   20,
    //   Color.green(),
    //   vec(),
    //   VILLAGER_LAYER
    // );
  }

  getName(): string {
    return `${this.id}_villager`;
  }
}
