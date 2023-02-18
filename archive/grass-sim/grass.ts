import { DisplayObject } from "../../src/engine/objects/displayObject";
import { vec, Vec } from "../engine/vec";
import { Color } from "../../src/engine/color";
import { DEBUG_GRASS } from "../../src/engine/settings";
import { renderer } from "./global";
import { DEBUG_LAYER } from "../../src/engine/renderer/renderer";

let id = 0;

export function createGrass(p: Vec = vec()): Grass {
  return new Grass(p);
}

export class Grass extends DisplayObject {
  constructor(pos: Vec) {
    super(++id, pos, "grass-section");
  }

  public getName(): string {
    return `${this.id} GRASS`;
  }

  public onPointerOver() {
    this.tint = Color.white();
  }

  public onPointerOut() {
    this.tint = Color.empty();
  }

  public onPointerDown() {
    this.tint = Color.white();
  }

  public onPointerUp() {
    this.tint = Color.empty();
    this.destroy();
  }

  public debug(): void {
    if (!DEBUG_GRASS) {
      return;
    }

    super.debug();

    if (DEBUG_GRASS) {
      renderer.fillText(
        this.id.toString(),
        this.getWorldPos(),
        Color.red(),
        DEBUG_LAYER
      );
    }
  }
}
