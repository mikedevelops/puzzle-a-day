import { createTimeManager } from "./time/TimeManager";
import { createEconomy } from "./economy/economy";

const DAY_DURATION = 1000;

export const time = createTimeManager(DAY_DURATION);
export const economy = createEconomy();
