import { Villager } from "../population/villager";
import { Building } from "../construction/building";

export enum Events {
  DayTick = "DAY_TICK",
  VillagerDeath = "VILLAGER_DEATH",
  VillagerAssignmentActive = "VILLAGER_ASSIGNMENT_ACTIVE",
}

export interface DayTickEventPayload {
  before: number;
  after: number;
}

export interface VillagerDeathEventPayload {
  id: number;
  reason: string;
}

export interface VillagerAssignmentActivePayload {
  villager: Villager;
  building: Building;
}
