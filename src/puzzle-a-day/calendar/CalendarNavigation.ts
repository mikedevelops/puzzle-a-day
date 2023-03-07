import { createId } from "../../engine/id/id";
import { UIObject } from "../ui/UIObject";
import { Vec, vec } from "../../engine/units/vec";
import { events, renderer } from "../../engine/global";
import { CalendarDate } from "./CalendarDate";
import { Color } from "../../engine/color";
import { UI_LAYER } from "../../engine/renderer/renderer";

const getId = createId();

export function createCalendarNav(dir: number): CalendarNav {
  return new CalendarNav(getId(), vec(), dir);
}

export class CalendarNav extends UIObject {
  constructor(id: number, pos: Vec, private dir: number) {
    super(id, pos);
  }

  public getDir(): number {
    return this.dir;
  }

  public draw(): void {
    renderer.fillRect(
      this.getWorldPos(),
      CalendarDate.Width,
      CalendarDate.Height,
      Color.green(),
      vec(),
      UI_LAYER
    );
    renderer.fillText(
      this.dir.toString(),
      this.getWorldPos(),
      Color.white(),
      CalendarDate.Width,
      UI_LAYER
    );
  }

  public getName(): string {
    return "UI_NAV_" + this.id;
  }

  public onClick() {
    events.trigger<{ dir: number }>("calendar_nav", { dir: this.dir });
  }
}
