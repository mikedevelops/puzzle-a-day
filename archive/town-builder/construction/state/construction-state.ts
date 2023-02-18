import { State } from "../../../../src/engine/stateMachine";
import { Building, isProducer } from "../building";
import { ProducerState } from "./producer-state";
import { notifications } from "../../../../src/engine/global";
import { CONSTRUCTION_STATE } from "./state";

export class ConstructionState extends State {
  private constructionDelta = 0;

  constructor(private building: Building, private duration: number) {
    super();
  }

  public enter(): void {
    notifications.createNotification({
      content: `Construction started: ${this.building.getName()}`,
    });
  }

  public getName(): string {
    return CONSTRUCTION_STATE;
  }

  public leave(): void {
    notifications.createNotification({
      content: `Construction completed: ${this.building.getName()}`,
    });
  }

  public update(delta: number): State | null {
    this.constructionDelta += delta;
    if (this.constructionDelta >= this.duration) {
      if (isProducer(this.building)) {
        return new ProducerState(this.building);
      } else {
        return this.building.getIdleState();
      }
    }
    return null;
  }
}
