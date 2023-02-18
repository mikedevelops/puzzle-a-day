import { State } from "../../../../src/engine/stateMachine";
import { Villager } from "../villager";
import { debug, events, renderer } from "../../../../src/engine/global";
import { Color } from "../../../../src/engine/color";
import { DEBUG_LAYER } from "../../../../src/engine/renderer/renderer";
import { Events, VillagerAssignmentActivePayload } from "../../events/events";
import { Handler } from "../../../../src/engine/events/EventManager";
import { Building } from "../../construction/building";
import { AssignmentActiveState } from "./AssignmentActiveState";

export const VILLAGER_IDLE_STATE = "villager_idle_state";

export class VillagerIdleState extends State {
  private readonly boundAssignmentActive: Handler;
  private assignment: Building | null = null;

  constructor(private villager: Villager) {
    super();
    this.boundAssignmentActive = this.onAssignmentActive.bind(this);
  }

  public enter(): void {
    events.listen(Events.VillagerAssignmentActive, this.boundAssignmentActive);
  }

  public onAssignmentActive(payload: VillagerAssignmentActivePayload): void {
    if (payload.villager.id !== this.villager.id) {
      return;
    }

    this.assignment = payload.building;
  }

  public getName(): string {
    return VILLAGER_IDLE_STATE;
  }

  public leave(): void {}

  public update(delta: number): State | null {
    if (this.assignment) {
      return new AssignmentActiveState(this.villager, this.assignment);
    }

    return null;
  }
}
