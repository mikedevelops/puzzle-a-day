import { Vec, vec } from "./vec";
import { Renderer } from "./renderer";
import { renderer } from "../grass-sim/global";
import { DEBUG_CAMERA, STAGE_HEIGHT, STAGE_WIDTH } from "./settings";
import { blue, Color, red } from "./color";

export function createCamera(renderer: Renderer, pos = vec()): Camera {
  return new Camera(renderer, pos);
}

export class Camera {
  constructor(private renderer: Renderer, public pos: Vec) {}

  public getOffset(): Vec {
    return this.pos.add(STAGE_WIDTH / 2, STAGE_HEIGHT / 2);
  }

  public debug(): void {
    if (!DEBUG_CAMERA) {
      return;
    }

    const { ctx } = renderer;
    const center = vec(STAGE_WIDTH / 2, STAGE_HEIGHT / 2);

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = Color.green().toString();
    ctx.fillStyle = Color.green().toString();
    ctx.moveTo(center.x, 0);
    ctx.lineTo(center.x, STAGE_HEIGHT);
    ctx.moveTo(0, center.y);
    ctx.lineTo(STAGE_WIDTH, center.y);
    ctx.closePath();
    ctx.stroke();
    ctx.fillText(center.toString(), center.x + 8, center.y - 8);
    ctx.restore();
  }

  public present(): void {
    this.renderer.draw(this.getOffset());
  }
}
