import type { DisplayObject } from "./displayObject";
import { vec, Vec } from "./vec";
import { DEBUG_COLLIDERS } from "./settings";
import { collision, logger, renderer } from "../grass-sim/global";
import { Color } from "./color";
import { DEBUG_LAYER } from "./renderer";

export function createCollider(path: Vec[], offset = vec()): Collider {
  const c = new Collider(path, offset);
  collision.addCollider(c);
  return c;
}

export class Collider {
  public obj: DisplayObject | null = null;
  private enabled = false;
  private worldPathCache: Vec[] | null = null;

  constructor(public path: Vec[], public offset = vec()) {}

  public isEnabled(): boolean {
    return this.obj !== null && this.enabled;
  }

  public enable(): void {
    if (!this.obj) {
      logger.warn("Cannot enable orphan collider!");
      return;
    }

    this.enabled = true;
  }

  public disable(): void {
    this.enabled = false;
  }

  public debug(): void {
    if (DEBUG_COLLIDERS && this.isEnabled()) {
      renderer.line(this.getWorldPath(), Color.blue(), DEBUG_LAYER);
    }
  }

  public getWorldPath(): Vec[] {
    if (!this.worldPathCache) {
      this.worldPathCache = this.path.map((p) =>
        p.addv(this.obj?.getWorldPos().addv(this.offset) ?? vec())
      );
    }

    return this.worldPathCache;
  }

  public destroy(): void {
    collision.removeCollider(this);
  }
}
