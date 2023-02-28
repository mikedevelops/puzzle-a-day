import { DisplayObject } from "./displayObject";
import { vec, Vec } from "../units/vec";
import { renderer } from "../global";
import { Color } from "../color";
import { DEFAULT_LAYER } from "../renderer/renderer";

export abstract class SpriteObject extends DisplayObject {
  constructor(
    id: number,
    pos: Vec,
    public sprite: string,
    public offset: Vec = vec(),
    public tint: Color = Color.empty()
  ) {
    super(id, pos);
  }

  public draw(alpha = 1, layer = DEFAULT_LAYER): void {
    const p = this.getWorldPos().addv(this.offset);
    renderer.renderSprite(this.sprite, p, this.tint, alpha, layer);
  }
}
