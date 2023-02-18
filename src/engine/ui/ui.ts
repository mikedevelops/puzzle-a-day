import { Panel, Position, Size } from "./panel";
import { UI_ENABLED } from "../settings";

export function createUIManager(): UI {
  return new UI();
}

export class UI {
  private panels: Set<Panel> = new Set();

  public addPanel(panel: Panel): void {
    this.panels.add(panel);
  }

  public drawPanel(panel: Panel): void {
    this.panels.add(panel);
  }

  public removePanel(pos: Position, size: Size): void {
    for (const p of this.panels) {
      if (p.pos === pos && p.size === size) {
        this.panels.delete(p);
      }
    }
  }

  public update(delta: number): void {}

  public draw(): void {
    if (!UI_ENABLED) {
      return;
    }

    for (const p of this.panels) {
      p.draw();
    }
  }
}
