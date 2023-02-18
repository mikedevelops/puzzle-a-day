import { createTimeManager } from "./time/TimeManager";
import { createEconomy } from "./economy/economy";
import { createPopulation } from "./population/population";
import { DAY_DURATION } from "../../src/engine/settings";
import { createPathManager } from "./construction/path/manager";
import { createConstructionManager } from "./construction/construction-manager";

export const PLACEMENT_ALPHA = 0.5;

export const time = createTimeManager(DAY_DURATION);
export const population = createPopulation();
export const economy = createEconomy();
export const construction = createConstructionManager();
export const paths = createPathManager();
