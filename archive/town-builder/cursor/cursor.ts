import { debug, input, renderer } from "../../../src/engine/global";
import { Color } from "../../../src/engine/color";
import { Vec, vec } from "../../engine/vec";
import { DisplayObject } from "../../../src/engine/objects/displayObject";
import { GameObject } from "../../../src/engine/objects/gameObject";
import { KeyInput } from "../../../src/engine/input/input";
import { Building } from "../construction/building";
import { construction } from "../global";
import { Path } from "../construction/path/path";
import { ConstructionManager } from "../construction/construction-manager";
import {
  createPlacement,
  PlacementCmd,
} from "../construction/placement/placement";
import { ConstructionType } from "../construction/construction";

export enum CursorState {
  Idle,
  Placement,
}

export function createCursor(): Cursor {
  return new Cursor();
}

class Cursor extends DisplayObject {
  private state: CursorState = CursorState.Idle;
  private pathStart: Path | null = null;
  private placement = createPlacement();

  constructor() {
    super(0, vec());
    this.add(this.placement);
  }

  public add(o: GameObject): void {
    o.pos = this.getPos();
    this.children.clear();
    super.add(o);
  }

  public start() {
    this.placement.init(this.getGrid());
  }

  public clearCursor(): void {
    this.children.clear();
  }

  private getPos(): Vec {
    return input.pointer.getWorldPos();
  }

  public debug(): void {
    debug.print(
      "cursor object",
      this.getActiveConstructionType()?.toString() ?? "null"
    );
  }

  private shouldPlace(): boolean {
    // TODO: add canAfford logic here eventually
    return (
      input.isPointerDownThisFrame() && this.state === CursorState.Placement
    );
  }

  public update(delta: number): void {
    super.update(delta);

    this.placement.pos = this.getPos();

    switch (input.getKeyDownThisFrame()) {
      case KeyInput.PathPlacementMode:
        this.state = CursorState.Placement;
        this.placement.enable(ConstructionType.Path, true);
        break;
      case KeyInput.CancelCurrentAction:
        this.state = CursorState.Idle;
        this.placement.disable();
        break;
    }

    const pos = this.getGrid().worldToLocalSnap(input.pointer.getWorldPos());
    if (!pos) {
      return;
    }

    if (this.shouldPlace()) {
      this.placement.place(pos.local);
    }

    this.placement.update(delta);
  }

  // private placeTemporaryConstruction(cmd: PlacementCmd): void {
  //   const newConstruction = ConstructionManager.createConstructionByType(
  //     cmd.type
  //   );
  //   newConstruction.temp = true;
  //   construction.addConstruction(newConstruction, cmd.pos);
  // }

  private getActiveObject(): GameObject | null {
    if (!this.children.size) {
      return null;
    }

    const [obj] = this.children;
    return obj;
  }

  private getActiveConstructionType(): ConstructionType | null {
    const obj = this.getActiveObject();
    if (!obj) {
      return null;
    }
    if (!(obj instanceof Building)) {
      return null;
    }

    return obj.type;
  }

  public draw(): void {
    super.draw();
    const pos = this.getPos();
    renderer.fillRect(pos, 6, 6, Color.green());
  }

  public getName(): string {
    return "cursor";
  }
}
