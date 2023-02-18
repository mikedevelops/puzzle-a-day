export enum Events {
  DayTick = "DAY_TICK",
  Harvest = "HARVEST",
}

export interface DayTickEventPayload {
  before: number;
  after: number;
}

export interface HarvestEventPayload {
  id: number;
}
