import { State } from "../../../../src/engine/stateMachine";
import { Villager } from "../villager";
import { Building } from "../../construction/building";

export const ASSIGNMENT_ACTIVE_STATE = "assignment_active_state";

export class AssignmentActiveState extends State {
  constructor(private villager: Villager, private building: Building) {
    super();
  }

  public enter(): void {
    this.villager.pos = this.building.pos.clone();
  }

  public getName(): string {
    return ASSIGNMENT_ACTIVE_STATE;
  }

  public leave(): void {}

  public update(delta: number): State | null {
    return null;
  }
}
