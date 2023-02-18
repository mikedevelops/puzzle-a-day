import { State } from "../../../../src/engine/stateMachine";
import { Sheep } from "../../sheep";
import { ui } from "../../global";
import { createPanel, Position, Size } from "../../../../src/engine/ui/panel";
import { createSheepPanel } from "../../ui/sheepPanel";

export class SheepHoverState extends State {
  public static Name = "SHEEP_HOVER";

  constructor(private sheep: Sheep) {
    super();
  }

  public enter(): void {
    ui.addPanel(createSheepPanel(this.sheep));
  }

  public leave(): void {
    ui.removePanel(Position.TopRight, Size.Small);
  }

  public update(delta: number): State | null {
    return null;
  }

  public getName(): string {
    return SheepHoverState.Name;
  }
}
