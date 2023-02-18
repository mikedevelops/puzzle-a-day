import { Vec, vec } from "../units/vec";
import { Renderer } from "../renderer/renderer";
import { DEBUG_CAMERA, STAGE_HEIGHT, STAGE_WIDTH } from "../settings";
import { Color } from "../color";
import { input, renderer } from "../global";
import { PointerState } from "../input/input";

export function createCamera(renderer: Renderer, pos = vec()): Camera {
  return new Camera(renderer, pos);
}

export class Camera {
  private pointerAnchor = vec();
  private posAnchor = vec();

  constructor(private renderer: Renderer, public pos: Vec) {}

  public getOffset(): Vec {
    return this.pos.add(STAGE_WIDTH / 2, STAGE_HEIGHT / 2);
  }

  public snapTo(p: Vec): void {
    this.pos = p;
  }

  public update(delta: number): void {
    if (
      input.isPointerDown() &&
      input.pointer.state === PointerState.Secondary
    ) {
      if (input.isPointerDownThisFrame()) {
        this.pointerAnchor = input.pointer.getScreenPos();
        this.posAnchor = this.pos.clone();
      }

      this.pos = this.posAnchor.addv(
        input.pointer.getScreenPos().subv(this.pointerAnchor)
      );
    }
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
    ctx.fillText(this.pos.toString(), center.x, center.y);
    ctx.restore();
  }

  public draw(): void {
    this.renderer.draw(this.getOffset());
  }
}
