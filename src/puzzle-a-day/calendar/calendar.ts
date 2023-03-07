import { SafeMap } from "../../engine/units/primitives";
import { UIObject } from "../ui/UIObject";
import { events, input, renderer } from "../../engine/global";
import { vec, Vec } from "../../engine/units/vec";
import { Color } from "../../engine/color";
import { UI_LAYER } from "../../engine/renderer/renderer";
import { CalendarDate, createDate } from "./CalendarDate";
import { PointerState } from "../../engine/input/input";
import { Rect } from "../../engine/units/rect";
import { CalendarNav, createCalendarNav } from "./CalendarNavigation";

export interface Day {
  date: Date;
  complete: boolean;
}

type CalendarData = SafeMap<string, Day>;

function getDays(): CalendarData {
  const today = new Date();
  const year = today.getFullYear();
  const start = new Date(today.getFullYear(), 0, 1);
  const days: CalendarData = new SafeMap();
  let lastDay = start;

  while (lastDay.getFullYear() === year) {
    days.set(lastDay.toString(), { date: lastDay, complete: false });
    const d = new Date(lastDay);
    d.setDate(d.getDate() + 1);
    lastDay = d;
  }

  return days;
}

function getDay(days: CalendarData, today: Date): Day {
  const index = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  return days.get(index.toString());
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth()
  );
}

export function createCalendar(
  width: number,
  height: number,
  active: Date
): Calendar {
  return new Calendar(0, vec(), width, height, Color.black(), active);
}

class Calendar extends UIObject {
  private days = getDays();

  constructor(
    id: number,
    pos: Vec,
    public width: number,
    public height: number,
    private color: Color,
    private activeDate: Date
  ) {
    super(id, pos);

    this.updateDays();
    this.add(createCalendarNav(-1), vec(CalendarDate.Padding, 0));
    this.add(
      createCalendarNav(1),
      vec(renderer.stage.width - (CalendarDate.Padding + CalendarDate.Width), 0)
    );

    events.listen("calendar_nav", (payload: { dir: number }) => {
      this.updateDateByDir(payload.dir);
    });
  }

  private updateDateByDir(dir: number): void {
    if (dir === 1) {
      const d = new Date(this.activeDate);
      d.setDate(d.getDate() + 1);
      this.activeDate = d;
      this.updateDays();
    }

    if (dir === -1) {
      const d = new Date(this.activeDate);
      d.setDate(d.getDate() - 1);
      this.activeDate = d;
      this.updateDays();
    }
  }

  public getName(): string {
    return "UI_CALENDAR";
  }

  public update(delta: number): void {
    if (
      input.isPointerDownThisFrame() &&
      input.pointer.state === PointerState.Primary &&
      this.isInside(input.pointer.getScreenPos())
    ) {
      const ui = this.getControlAtPos(input.pointer.getScreenPos());
      if (ui !== null) {
        ui.onClick();

        if (ui instanceof CalendarDate) {
          this.activeDate = ui.getDay().date;
          console.log(this.activeDate);
        }

        if (ui instanceof CalendarNav) {
          events.trigger<{ date: Date }>("update_date", {
            date: this.activeDate,
          });
        }

        this.updateDays();
      }
    }
  }

  private updateDays() {
    for (const c of this.children) {
      if (c instanceof CalendarDate) {
        this.remove(c);
      }
    }

    const range = this.getDaysToDraw();
    const rangeWidth =
      range.length * (CalendarDate.Width + CalendarDate.Padding) -
      CalendarDate.Padding;
    let x = renderer.stage.width / 2 - rangeWidth / 2;
    for (const d of range) {
      this.add(createDate(d, vec(x, 0), isSameDay(d.date, this.activeDate)));
      x += CalendarDate.Width + CalendarDate.Padding;
    }
  }

  private getControlAtPos(pos: Vec): UIObject | null {
    const days = [...this.children] as UIObject[];
    for (const d of days) {
      const r = Rect.getRect({
        pos: d.getWorldPos(),
        width: CalendarDate.Width,
        height: CalendarDate.Height,
      });
      if (r.contains(pos)) {
        return d;
      }
    }
    return null;
  }

  private isInside(pos: Vec): boolean {
    const rect = Rect.getRect(this);
    return rect.contains(pos);
  }

  private getDaysToDraw(): Day[] {
    const today = getDay(this.days, this.activeDate);
    const days: Day[] = [today];
    let lastPositiveDay = today.date;
    let lastNegativeDay = today.date;

    for (let i = 0; i < this.getDrawableDayLength() - 1; i++) {
      if (i % 2 !== 0) {
        const d = new Date(lastPositiveDay);
        d.setDate(d.getDate() + 1);
        days.push(getDay(this.days, d));
        lastPositiveDay = d;
      } else {
        const d = new Date(lastNegativeDay);
        d.setDate(d.getDate() - 1);
        days.unshift(getDay(this.days, d));
        lastNegativeDay = d;
      }
    }

    return days;
  }

  private getDrawableDayLength(): number {
    const days = Math.floor(
      renderer.stage.width / (CalendarDate.Width + CalendarDate.Padding) - 2
    );
    if (days % 2 === 0) {
      return days - 1;
    }

    return days;
  }

  public draw(): void {
    renderer.fillRect(
      this.pos,
      this.width,
      this.height,
      this.color,
      vec(),
      UI_LAYER
    );
  }

  // TODO: this is lame, calendar is currently capturing and triaging events to children
  public onClick(): void {}
}
