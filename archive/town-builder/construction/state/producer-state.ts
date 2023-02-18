import { State } from "../../../../src/engine/stateMachine";
import { Producer } from "../building";
import { economy } from "../../global";
import { PRODUCER_STATE } from "./state";

export class ProducerState extends State {
  private productionDelta = 0;

  constructor(private building: Producer) {
    super();
  }

  public enter(): void {}

  public getName(): string {
    return PRODUCER_STATE;
  }

  public leave(): void {}

  public update(delta: number): State | null {
    this.productionDelta += delta;
    if (this.productionDelta >= this.building.getProductionInterval()) {
      this.productionDelta = 0;
      if (this.building.isEnabled()) {
        economy.addResource(
          this.building.getResourceType(),
          this.building.produce()
        );
      }
    }

    return null;
  }
}
