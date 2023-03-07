import { DisplayObject } from "../../engine/objects/displayObject";

export abstract class UIObject extends DisplayObject {
  public abstract onClick(): void;
}
