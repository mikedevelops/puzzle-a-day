import { UIObject } from "../ui/UIObject";
import { Day } from "./calendar";
import { vec, Vec } from "../../engine/units/vec";
import { events, renderer } from "../../engine/global";
import { GRID_UNIT } from "../../engine/settings";
import { Color } from "../../engine/color";
import { UI_LAYER } from "../../engine/renderer/renderer";

export function createDate(day: Day, pos: Vec, active: boolean): CalendarDate {
  return new CalendarDate(day.date.getTime(), pos, day, active);
}

export class CalendarDate extends UIObject {
  public static Width = GRID_UNIT * 2.5;
  public static Height = GRID_UNIT * 2.5;
  public static Padding = GRID_UNIT / 2;
  constructor(id: number, pos: Vec, private day: Day, private active: boolean) {
    super(id, pos);
  }
  public draw(): void {
    renderer.fillRect(
      this.getWorldPos(),
      CalendarDate.Width,
      CalendarDate.Height,
      this.active ? Color.white() : Color.red(),
      vec(),
      UI_LAYER
    );
    renderer.fillText(
      `${this.day.date.getDate()}/${this.day.date.getMonth() + 1}`,
      this.getWorldPos(),
      Color.green(),
      CalendarDate.Width,
      UI_LAYER
    );
  }

  public setActive(active: boolean): void {
    this.active = active;
  }

  public getDay(): Day {
    return this.day;
  }

  public getName(): string {
    return "";
  }

  public onClick(): void {
    events.trigger<{ date: Date }>("update_date", { date: this.day.date });
  }
}
