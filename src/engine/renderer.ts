import { Vec } from "./vec";
import {
  DEBUG,
  DEBUG_SPRITES,
  GRID_UNIT,
  STAGE_HEIGHT,
  STAGE_WIDTH,
} from "./settings";
import { Color } from "./color";
import { sprites } from "../grass-sim/global";
import { CTX, getCanvas } from "./canvas";
import * as fx from "./fx";

interface DrawCall {
  draw: (offset: Vec) => void;
  z: number;
}

export const DEBUG_LAYER = 999;

export function createRenderer(): Renderer {
  const c = getCanvas();

  c.el.width = STAGE_WIDTH;
  c.el.height = STAGE_HEIGHT;
  c.ctx.fillStyle = Color.black().toString();

  return new Renderer(c.el, c.ctx);
}

export class Renderer {
  constructor(
    public canvas: HTMLCanvasElement,
    public ctx: CTX,
    private queue: Set<DrawCall> = new Set()
  ) {}

  public clear() {
    this.ctx.clearRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);

    // TODO: debug code
    this.ctx.save();
    this.ctx.fillStyle = Color.blue().toString();
    this.ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
    this.ctx.restore();
  }

  public fillRect(
    pos: Vec,
    width: number,
    height: number,
    color: Color,
    z?: number
  ): void {
    this.queue.add({
      draw: (offset) => {
        const wp = pos.addv(offset);
        this.ctx.save();
        this.ctx.fillStyle = color.toString();
        this.ctx.fillRect(wp.x, wp.y, width, height);
        this.ctx.restore();
      },
      z: z ?? pos.y,
    });
  }

  public strokeRect(
    pos: Vec,
    width: number,
    height: number,
    color: string,
    z?: number
  ): void {
    this.queue.add({
      draw: (offset) => {
        const wp = pos.addv(offset);
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(wp.x, wp.y, width, height);
        this.ctx.restore();
      },
      z: z ?? pos.y,
    });
  }

  public fillText(text: string, pos: Vec, color: Color, z?: number): void {
    this.queue.add({
      draw: (offset) => {
        const wp = pos.addv(offset);
        this.ctx.save();
        this.ctx.fillStyle = color.toString();
        this.ctx.fillText(text, wp.x, wp.y);
        this.ctx.restore();
      },
      z: z ?? pos.y,
    });
  }

  // public ray(ray: Ray, color = Color.blue()): void {
  //   this.queue.add({
  //     draw: () => {
  //       this.ctx.save();
  //       this.ctx.strokeStyle = color.toString();
  //       this.ctx.fillStyle = color.toString();
  //       this.ctx.beginPath();
  //       this.ctx.moveTo(ray.start.x, ray.start.y);
  //       this.ctx.lineTo(ray.end.x, ray.end.y);
  //       this.ctx.closePath();
  //       this.ctx.fillText(
  //         ray.start.distance(ray.end).toFixed(2),
  //         ray.end.x,
  //         ray.end.y
  //       );
  //       this.ctx.stroke();
  //
  //       for (const p of ray.getPoints()) {
  //         this.ctx.fillRect(p.x, p.y, 4, 4);
  //       }
  //
  //       this.ctx.restore();
  //     },
  //     y: 0,
  //     layer: DEBUG_LAYER,
  //   });
  // }

  public line(points: Vec[], color: Color, z?: number): void {
    this.queue.add({
      draw: (offset) => {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = color.toString();

        for (let i = 0; i < points.length; i++) {
          const { x, y } = points[i].addv(offset);
          if (i === 0) {
            this.ctx.moveTo(x, y);
          } else {
            this.ctx.lineTo(x, y);
          }
        }

        for (const p of points.slice(1)) {
          this.ctx.lineTo(p.addv(offset).x, p.addv(offset).y);
        }

        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
      },
      z: z ?? points[0].y,
    });
  }

  public renderSprite(key: string, pos: Vec, z: number, tint?: Color): void {
    this.queue.add({
      draw: (offset) => {
        const sprite = sprites.get(key);
        const wp = pos.addv(offset);

        if (!sprite) {
          this.ctx.save();
          this.ctx.fillStyle = Color.magenta().toString();
          this.ctx.fillRect(wp.x, wp.y, GRID_UNIT, GRID_UNIT);
          this.ctx.restore();
          return;
        }

        const sp = wp.addv(sprite.offset);
        const width = sprite.getWidth();
        const height = sprite.getHeight();

        if (DEBUG_SPRITES) {
          this.ctx.strokeStyle = Color.red().toString();
          this.ctx.strokeRect(sp.x, sp.y, width, height);
        }

        let cvs = sprite.img.canvas;

        if (tint) {
          cvs = fx.tint(sp, sprite.img, tint);
        }

        this.ctx.drawImage(cvs, 0, 0, width, height, sp.x, sp.y, width, height);
      },
      z,
    });
  }

  public draw(offset: Vec): void {
    // sort queue
    const sorted = [...this.queue].sort((a, b) => {
      return a.z - b.z;
    });

    for (const sdc of sorted) {
      // skip debug objs if debug mode is disabled
      if (sdc.z === DEBUG_LAYER && !DEBUG) {
        continue;
      }

      sdc.draw(offset);
    }

    this.queue.clear();
  }
}
