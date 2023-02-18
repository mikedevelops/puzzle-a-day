import { Collider } from "./collider";
import { Vec } from "./units/vec";
import { CTX, getCanvas } from "./canvas";
import { camera, renderer, debug } from "./global";
import { DEBUG_COLLIDERS, DEBUG_COLLISION } from "./settings";
import { GameObject } from "./objects/gameObject";

export function createCollisionManager(): CollisionManager {
  return new CollisionManager();
}

export class CollisionManager {
  private colliders = new Set<Collider>();
  private ctx: CTX;
  private cache: Uint8ClampedArray | null = null;

  constructor() {
    const cvs = getCanvas("collision", {
      willReadFrequently: true,
    });
    cvs.el.width = renderer.canvas.width;
    cvs.el.height = renderer.canvas.height;
    this.ctx = cvs.ctx;
  }

  public addCollider(c: Collider): void {
    this.colliders.add(c);
  }

  public removeCollider(c: Collider): void {
    this.colliders.delete(c);
  }

  public getObjAt(p: Vec): GameObject[] {
    const start = Date.now();
    const offset = camera.getOffset();
    const objs: GameObject[] = [];

    for (const c of this.colliders) {
      if (!c.obj) {
        continue;
      }

      /**
       * Abstract this collision detection....
       */
      const path = c.getWorldPath()?.map((p) => p.addv(offset));
      if (path.every((p) => !renderer.willDraw(p))) {
        c.disable();
      }

      if (!c.isEnabled()) {
        continue;
      }

      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

      this.ctx.beginPath();
      this.ctx.fillStyle = "red";
      for (let i = 0; i < path.length; i++) {
        if (i === 0) {
          this.ctx.moveTo(path[i].x, path[i].y);
        } else {
          this.ctx.lineTo(path[i].x, path[i].y);
        }
      }
      this.ctx.fill();
      this.ctx.closePath();

      // if (!this.cache) {
      this.cache = this.ctx.getImageData(p.x, p.y, 1, 1).data;
      // }

      if (this.cache[0] || this.cache[1] || this.cache[2]) {
        objs.push(c.obj);
      }
      this.ctx.fillStyle = "blue";
      this.ctx.fillRect(p.x, p.y, 4, 4);
    }

    if (DEBUG_COLLISION) {
      debug.sample("COLLISION RESOLVED", Date.now() - start, 30, (value) => {
        return value.toFixed(2) + "ms";
      });
    }

    return objs;
  }

  public debug() {
    if (DEBUG_COLLIDERS) {
      debug.print(
        "active colliders",
        [...this.colliders].filter((c) => c.isEnabled()).length
      );
    }
  }
}
