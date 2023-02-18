import { State } from "../../../../src/engine/stateMachine";
import { debug, events } from "../../../../src/engine/global";
import { HasDays } from "./TimeMachine";
import { clamp } from "../../../../src/engine/maths";
import { DayTickEventPayload, Events } from "../../events/events";

export class TickState extends State implements HasDays {
  private lastTick: number;
  private day = 0;
  constructor(private dayDuration: number, private time: number = 0) {
    super();
    // TODO: (refactor) centralise date & time
    this.lastTick = Date.now();
  }

  public getName(): string {
    return "TICK";
  }

  public enter(): void {}
  public leave(): void {}

  public update(delta: number): State | null {
    // TODO: (refactor) centralise date & time
    this.time += Date.now() - this.lastTick;
    this.lastTick = Date.now();
    this.tick();

    return null;
  }

  public tick(): void {
    if (this.time > this.dayDuration) {
      this.time = 0;
      this.day++;
      events.trigger<DayTickEventPayload>(Events.DayTick, {
        before: clamp(this.day - 1, 0, Infinity),
        after: this.day,
      });
    }
  }

  public debug() {
    debug.print("DAY", `${this.getDay().toFixed(2)}`);
    super.debug();
  }

  public getDay(): number {
    return this.day + this.getDayProgress();
  }

  private getDayProgress(): number {
    return clamp(this.time / this.dayDuration, 0, 1);
  }
}
