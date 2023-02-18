import { State } from "../../../../../src/engine/stateMachine";
import { DayTickEventPayload, Events } from "../../../events/events";
import { events } from "../../../../../src/engine/global";
import { Handler as EventHandler } from "../../../../../src/engine/events/EventManager";
import { Handler as PointerHandler } from "../../../../../src/engine/objects/gameObject";
import { GrowNode } from "../GrowNode";
import { WaitingToGrowState } from "./WaitingToGrowState";

export class GrowState extends State {
  private readonly boundDayTick: EventHandler;
  private readonly boundPointerDown: PointerHandler;

  constructor(private node: GrowNode) {
    super();
    this.boundDayTick = this.onDayTick.bind(this);
    this.boundPointerDown = this.onPointerDown.bind(this);
  }

  public getName(): string {
    return "GROW";
  }

  public enter(): void {
    events.listen(Events.DayTick, this.boundDayTick);
    this.node.registerHandler("onPointerDown", this.boundPointerDown);
  }

  public leave(): void {
    events.remove(Events.DayTick, this.boundDayTick);
    this.node.removeHandler("onPointerDown", this.boundPointerDown);
  }

  private onPointerDown(): void {
    this.node.harvest();
  }

  private onDayTick(payload: DayTickEventPayload): void {
    // TODO: (refactor) setTimeout makes me uneasy vs calculating runtime delta to measure time
    //  we can't guarantee order of operation...
    // setTimeout(() => {
    this.node.grow(payload.after);
    // }, randInt(0, time.dayDuration / 2));
  }

  public update(delta: number): State | null {
    if (this.node.isHarvested()) {
      return new WaitingToGrowState(this.node);
    }

    return null;
  }
}
