import { DisplayObject } from "./displayObject";
import { vec, Vec } from "../units/vec";
import { renderer } from "../global";
import { Color } from "../color";

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

  public draw(alpha: number = 1): void {
    const p = this.getWorldPos().addv(this.offset);
    renderer.renderSprite(this.sprite, p, this.tint, alpha);
  }
}
