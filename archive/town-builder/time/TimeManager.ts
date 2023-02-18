import { GameObject } from "../../../src/engine/objects/gameObject";
import { vec } from "../../engine/vec";
import { TickState } from "./state/TickState";
import { debug } from "../../../src/engine/global";
import { createTimeMachine, TimeMachine } from "./state/TimeMachine";

export function createTimeManager(dayDuration: number): TimeManager {
  const sm = createTimeMachine(new TickState(dayDuration));
  return new TimeManager(dayDuration, sm);
}

class TimeManager extends GameObject {
  private readonly instance: TimeManager | null = null;
  public stateMachine: TimeMachine;

  constructor(public dayDuration: number, sm: TimeMachine) {
    super(0, vec());
    if (this.instance) {
      throw new Error("Multiple TimeManager instances!");
    } else {
      this.instance = this;
    }

    this.stateMachine = sm;
  }

  public getName(): string {
    return "TIME_MANAGER";
  }

  public debug() {
    debug.print("DAY DURATION", `${(this.dayDuration / 1000).toFixed(2)}s`);
    super.debug();
  }

  public getDay(): number {
    return this.stateMachine.getDay();
  }
}
