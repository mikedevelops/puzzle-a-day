import { vec, Vec } from "../../../engine/vec";
import { SPRITE_SCALE, SPRITE_SIZE } from "../../../../src/engine/settings";
import { PLACEMENT_ALPHA } from "../../global";
import { Construction, ConstructionType } from "../construction";

export function createPath(blueprint: boolean, pos: Vec = vec()): Path {
  return new Path(
    blueprint,
    ConstructionType.Path,
    pos,
    Path.getSprite(),
    Path.getSpriteOffset()
  );
}

export class Path extends Construction {
  public static getSprite(): string {
    return "builder_4";
  }

  public static getSpriteOffset(): Vec {
    const unit = SPRITE_SIZE * SPRITE_SCALE;
    return vec(-(unit / 8), -(unit / 4));
  }

  public getName(): string {
    return `path_${this.id}`;
  }

  public draw(): void {
    super.draw(this.blueprint ? PLACEMENT_ALPHA : 1);
  }
}
