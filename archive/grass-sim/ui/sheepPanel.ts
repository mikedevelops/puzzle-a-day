import {
  FONT_SIZE,
  PADDING,
  Panel,
  Position,
  Size,
} from "../../../src/engine/ui/panel";
import { Sheep } from "../sheep";
import { renderer } from "../global";
import { Color } from "../../../src/engine/color";
import { UI_LAYER } from "../../../src/engine/renderer/renderer";

export function createSheepPanel(sheep: Sheep): SheepPanel {
  return new SheepPanel(sheep, Position.TopRight, Size.Small);
}

export class SheepPanel extends Panel {
  constructor(private sheep: Sheep, pos: Position, size: Size) {
    super(sheep.getName(), pos, size);
  }

  public draw() {
    const r = this.getRect();
    renderer.fillRect(r.pos, r.width, r.height, Color.black(), UI_LAYER);

    const newline = FONT_SIZE;
    let y = PADDING / 2 + FONT_SIZE;

    // Name
    renderer.fillText(
      this.sheep.getName(),
      r.pos.add(PADDING, y),
      Color.white(),
      UI_LAYER
    );
    y += newline;

    // Stats
    renderer.fillText(
      `HP ${this.sheep.hp}`,
      r.pos.add(PADDING, y),
      Color.white(),
      UI_LAYER
    );
    y += newline;

    renderer.fillText(
      `Hunger ${this.sheep.hunger}`,
      r.pos.add(PADDING, y),
      Color.white(),
      UI_LAYER
    );
    y += newline;

    renderer.fillText(
      `Size ${this.sheep.size}`,
      r.pos.add(PADDING, y),
      Color.white(),
      UI_LAYER
    );
  }
}
