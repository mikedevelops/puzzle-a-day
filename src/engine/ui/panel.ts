import { vec, Vec } from "../units/vec";
import { renderer } from "../global";
import { Color } from "../color";
import { UI_LAYER } from "../renderer/renderer";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../settings";
import { rect, Rect } from "../units/rect";

export enum Position {
  TopRight,
  BottomRight,
}

export enum Size {
  Small,
}

export const PADDING = 16;
export const FONT_SIZE = 16;

export function createPanel(
  content: string,
  pos: Position,
  size: Size = Size.Small
): Panel {
  return new Panel(content, pos, size);
}

export class Panel {
  constructor(
    private content: string,
    public pos: Position,
    public size: Size
  ) {}

  protected getRect(): Rect {
    const p = this.getPos();
    const [w, h] = this.getWidthAndHeight();
    return rect(p.x, p.y, w, h);
  }

  private getPos(): Vec {
    const [w, h] = this.getWidthAndHeight();
    switch (this.pos) {
      case Position.TopRight:
        return vec(STAGE_WIDTH / 2, PADDING);
      case Position.BottomRight:
        return vec(STAGE_WIDTH / 2, STAGE_HEIGHT - h - PADDING);
      default:
        throw new Error(`Cannot draw panel with position: ${this.pos}`);
    }
  }

  private getWidthAndHeight(): [width: number, height: number] {
    switch (this.size) {
      case Size.Small:
        return [STAGE_WIDTH / 2 - PADDING, STAGE_HEIGHT / 4 - PADDING];
      default:
        throw new Error(`Cannot draw panel with size: ${this.size}`);
    }
  }

  public setContent(content: string): void {
    this.content = content;
  }

  public draw(): void {
    const [width, height] = this.getWidthAndHeight();
    const pos = this.getPos();
    renderer.fillRect(pos, width, height, Color.black(), vec(), UI_LAYER);
    renderer.fillText(
      this.content,
      pos.add(PADDING, PADDING / 2 + FONT_SIZE),
      Color.white(),
      width - PADDING * 2,
      UI_LAYER
    );
  }
}
