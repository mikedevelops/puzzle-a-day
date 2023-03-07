import { vec, Vec } from "../units/vec";
import {
  DEBUG,
  DEBUG_SPRITES,
  GRID_UNIT,
  SPRITES_ENABLED,
  STAGE_HEIGHT,
  STAGE_WIDTH,
} from "../settings";
import { Color } from "../color";
import { debug, sprites } from "../global";
import { CTX, getCanvas } from "../canvas";
import * as fx from "../fx";
import { FONT_SIZE } from "../ui/panel";
import { rect, Rect } from "../units/rect";

interface DrawCall {
  draw: (offset: Vec) => void;
  y: number;
  z: number;
}

// TODO: layers need to be defined in the game, not the engine
export const DEBUG_LAYER = 888;
export const UI_LAYER = 999;
export const CURSOR_LAYER = 1000;
export const DEFAULT_LAYER = 666;
export const BACKGROUND_LAYER = 555;

export function createRenderer(): Renderer {
  const c = getCanvas();

  c.ctx.fillStyle = Color.black().toString();
  c.el.width = STAGE_WIDTH;
  c.el.height = STAGE_HEIGHT;
  // c.ctx.scale(scale, scale);

  return new Renderer(c.el, c.ctx);
}

export class Renderer {
  public stage: Rect;
  constructor(
    public canvas: HTMLCanvasElement,
    public ctx: CTX,
    private queue: Set<DrawCall> = new Set()
  ) {
    const bcr = this.canvas.getBoundingClientRect();
    // TODO: refresh this if the window changes
    this.stage = rect(0, 0, bcr.width, bcr.height);
    this.ctx.font = `${FONT_SIZE}px monospace`;
  }

  public clear() {
    this.ctx.clearRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);

    // TODO: debug code
    this.ctx.save();
    this.ctx.fillStyle = new Color(21, 50, 67).toString();
    this.ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
    this.ctx.restore();
  }

  private getWorldPos(pos: Vec, camOffset: Vec, z?: number): Vec {
    switch (z) {
      case UI_LAYER:
        return pos.clone();
      default:
        return pos.addv(camOffset);
    }
  }

  public fillRect(
    pos: Vec,
    width: number,
    height: number,
    color: Color,
    originOffset = vec(),
    z?: number
  ): void {
    this.queue.add({
      draw: (offset) => {
        const wp = this.getWorldPos(pos, offset, z).addv(originOffset);
        this.ctx.save();
        this.ctx.fillStyle = color.toString();
        this.ctx.fillRect(wp.x, wp.y, width, height);
        this.ctx.restore();
      },
      z: z ?? pos.y,
      y: pos.y,
    });
  }

  public drawISoRect(
    pos: Vec,
    width: number,
    height: number,
    color: Color,
    fill = true,
    originOffset = vec(0, 0),
    strokeWidth = 4,
    z?: number
  ): void {
    this.queue.add({
      draw: (offset) => {
        const wp = this.getWorldPos(pos, offset, z).addv(originOffset);
        this.ctx.save();
        this.ctx.beginPath();
        if (fill) {
          this.ctx.fillStyle = color.toString();
        } else {
          this.ctx.strokeStyle = color.toString();
          this.ctx.lineWidth = strokeWidth;
        }

        this.ctx.moveTo(wp.x, wp.y);
        this.ctx.lineTo(wp.x + width, wp.y + height / 2);
        this.ctx.lineTo(wp.x, wp.y + height);
        this.ctx.lineTo(wp.x - width, wp.y + height / 2);

        this.ctx.closePath();
        if (fill) {
          this.ctx.fill();
        } else {
          this.ctx.stroke();
        }
        this.ctx.restore();
      },
      z: z ?? pos.y,
      y: pos.y,
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
        const wp = this.getWorldPos(pos, offset, z);
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(wp.x, wp.y, width, height);
        this.ctx.restore();
      },
      z: z ?? pos.y,
      y: pos.y,
    });
  }

  public fillText(
    text: string,
    pos: Vec,
    color: Color,
    maxWidth?: number,
    z?: number
  ): void {
    this.queue.add({
      draw: (offset) => {
        const wp = this.getWorldPos(pos, offset, z);
        this.ctx.save();
        this.ctx.fillStyle = color.toString();
        this.ctx.font = `${FONT_SIZE}px monospace`;

        if (z === UI_LAYER) {
          this.ctx.font = `${FONT_SIZE}px monospace`;
        }

        let newlineOffset = 0;
        for (const line of text.split("\n")) {
          this.ctx.fillText(line, wp.x, wp.y + newlineOffset, maxWidth);
          newlineOffset += FONT_SIZE;
        }

        this.ctx.restore();
      },
      z: z ?? pos.y,
      y: pos.y,
    });
  }

  public path(
    points: Vec[],
    color: Color,
    lineWidth: number,
    z?: number
  ): void {
    this.queue.add({
      draw: (offset) => {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = color.toString();
        this.ctx.lineWidth = lineWidth;

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
      y: points[0].y,
    });
  }

  public renderSprite(
    key: string,
    pos: Vec,
    tint = Color.empty(),
    alpha = 1,
    layer = DEFAULT_LAYER,
    rotation = 0
  ): void {
    if (!SPRITES_ENABLED) {
      return;
    }

    this.queue.add({
      draw: (offset) => {
        const sprite = sprites.get(key);
        const wp = this.getWorldPos(pos, offset, layer);

        if (!sprite) {
          this.ctx.fillStyle = Color.magenta().toString();
          this.ctx.save();
          this.ctx.fillRect(wp.x, wp.y, GRID_UNIT, GRID_UNIT);
          this.ctx.restore();
          return;
        }

        const sp = wp.addv(sprite.offset);
        const width = sprite.getWidth();
        const height = sprite.getHeight();

        if (DEBUG_SPRITES) {
          this.ctx.strokeStyle = Color.red().toString();
          this.ctx.fillRect(wp.x, wp.y, 10, 10);
          this.ctx.strokeRect(sp.x, sp.y, width, height);
        }

        let cvs = sprite.img.canvas;

        // TODO: I don't think this works anymore
        if (tint) {
          cvs = fx.tint(sp, sprite.img, tint);
        }

        if (alpha) {
          this.ctx.globalAlpha = alpha;
        }

        this.ctx.save();
        if (rotation) {
          // TODO: erm, figure this out
          this.ctx.translate(400, 0);
          this.ctx.rotate(rotation);
        }
        this.ctx.drawImage(cvs, 0, 0, width, height, sp.x, sp.y, width, height);
        this.ctx.restore();
      },
      y: pos.y,
      z: layer,
    });
  }

  public draw(offset: Vec): void {
    const layers: Map<number, DrawCall[]> = new Map();
    for (const call of this.queue) {
      const q = layers.get(call.z) ?? [];
      layers.set(call.z, [...q, call]);
    }

    for (const calls of layers.values()) {
      calls.sort((a, b) => {
        return a.y - b.y;
      });
    }

    const sortedLayers = [...layers.keys()].sort((a, b) => a - b);

    for (const layer of sortedLayers) {
      const calls = layers.get(layer)!;
      for (const call of calls) {
        this.ctx.save();
        call.draw(offset);
        this.ctx.restore();
      }
    }

    this.queue.clear();
  }

  // TODO: culling...
  //  1. create rect from stage
  //  2. implement rect.contains(p)

  // Can the renderer draw a point, i.e. is it in bounds of the stage
  public willDraw(p: Vec): boolean {
    return this.stage.contains(p);
  }
}
