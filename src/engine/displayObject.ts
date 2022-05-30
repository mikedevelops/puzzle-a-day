import { vec, Vec } from "./vec";
import { renderer } from "../grass-sim/global";
import { Color } from "./color";
import { Layer } from "../grass-sim/layer";
import { Collider } from "./collider";
import { DEBUG_COLLIDERS, DEBUG_DISPLAY_OBJS } from "./settings";
import { StateMachine } from "./stateMachine";

export type DisplayObjectFactory = (pos: Vec) => DisplayObject;

export class DisplayObject {
  public parent: Layer | null = null;
  public offset = vec();
  public collider: Collider | null = null;

  constructor(
    public pos: Vec,
    public sprite: string,
    public tint: Color = Color.empty(),
    public stateMachine?: StateMachine
  ) {}

  public getName(): string {
    return `[${this.pos.toString()},${this.sprite}]`;
  }

  public addCollider(c: Collider) {
    this.collider = c;
    this.collider.obj = this;
    this.collider.enable();
  }

  public draw(): void {
    if (!this.parent) {
      return;
    }

    renderer.renderSprite(
      this.sprite,
      this.parent.getWorldPos(this).addv(this.offset),
      this.parent.index,
      this.tint
    );
  }

  public getWorldPos(): Vec {
    if (!this.parent) {
      return this.pos.addv(this.offset);
    }

    return this.parent.getWorldPos(this).addv(this.offset);
  }

  public debug(): void {
    if (DEBUG_DISPLAY_OBJS) {
      const p = this.getParent().getWorldPos(this.pos);
      renderer.fillRect(p, 8, 8, Color.magenta());
      renderer.fillText(this.pos.toString(), p.add(0, 16), Color.magenta());
    }

    if (DEBUG_COLLIDERS) {
      this.collider?.debug();
    }
  }

  public update(delta: number): void {
    this.stateMachine?.update(delta);
  }

  public destroy(): void {
    this.parent?.remove(this);
    this.collider?.destroy();
  }

  public getParent(): Layer {
    if (!this.parent) {
      throw new Error("Attempted to access parent, but it did not exist!");
    }
    return this.parent;
  }

  public onPointerDown(): void {}
  public onPointerUp(): void {}
  public onPointerOver(): void {}
  public onPointerOut(): void {}
}
