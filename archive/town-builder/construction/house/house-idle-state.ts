import { State } from "../../../../src/engine/stateMachine";
import { population } from "../../global";
import { HOUSE_POP_INCREASE } from "./house";
import { HOUSE_IDLE_STATE } from "../state/state";

export class HouseIdleState extends State {
  public enter(): void {
    // population.addPopulation(HOUSE_POP_INCREASE);
  }

  public getName(): string {
    return HOUSE_IDLE_STATE;
  }

  public leave(): void {}

  public update(delta: number): State | null {
    return null;
  }
}
