import { DisplayObject } from "./displayObject";
import { vec, Vec } from "../units/vec";
import { renderer } from "../global";
import { Color } from "../color";
import { DEFAULT_LAYER } from "../renderer/renderer";

export interface Sprite {
  prefix: string;
  frame: number;
}

export abstract class SpriteObject extends DisplayObject {
  constructor(
    id: number,
    pos: Vec,
    public sprite: Sprite,
    public offset: Vec = vec(),
    public tint: Color = Color.empty()
  ) {
    super(id, pos);
  }

  public getSpritePath(): string {
    return `${this.sprite.prefix}_${this.sprite.frame}`;
  }

  public draw(alpha = 1, layer = DEFAULT_LAYER, rotation = 0): void {
    const p = this.getWorldPos().addv(this.offset);
    renderer.renderSprite(
      this.getSpritePath(),
      p,
      this.tint,
      alpha,
      layer,
      rotation
    );
  }
}
