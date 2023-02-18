import { SpriteObject } from "../../../src/engine/objects/spriteObject";
import { vec, Vec } from "../../engine/vec";
import { createId } from "../../../src/engine/id/id";

export enum ConstructionType {
  Farm = "farm",
  House = "house",
  Sawmill = "sawmill",
  Warehouse = "warehouse",
  Path = "path",
}

const id = createId();

export abstract class Construction extends SpriteObject {
  constructor(
    public blueprint: boolean,
    public type: ConstructionType,
    pos: Vec,
    sprite: string,
    offset = vec()
  ) {
    super(id(), pos, sprite, offset);
  }
}
