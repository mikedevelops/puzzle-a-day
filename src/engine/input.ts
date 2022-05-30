import { vec, Vec } from "./vec";
import { Camera } from "./camera";
import { camera } from "../grass-sim/global";
import { STAGE_HEIGHT, STAGE_WIDTH } from "./settings";

enum PointerState {
  Idle,
  Main,
}

class Pointer {
  public state = PointerState.Idle;

  constructor(public x = 0, public y = 0) {}

  public getScreenPos(): Vec {
    return Vec.from(this).addv(camera.getOffset());
  }
}

export function createInputManager(
  canvas: HTMLCanvasElement,
  camera: Camera
): InputManager {
  const r = canvas.getBoundingClientRect();
  return new InputManager(vec(r.left, r.top), camera);
}

class InputManager {
  public pointer = new Pointer(-(STAGE_WIDTH / 2), -(STAGE_HEIGHT / 2));

  constructor(public offset: Vec, private camera: Camera) {}

  public start(): void {
    document.addEventListener("mousemove", (event) => {
      const camOffset = this.camera.getOffset();
      this.pointer.x = event.clientX - this.offset.x - camOffset.x;
      this.pointer.y = event.clientY - this.offset.y - camOffset.y;
    });

    document.addEventListener("pointerdown", (event) => {
      this.pointer.state = PointerState.Main;
    });

    document.addEventListener("pointerup", (event) => {
      this.pointer.state = PointerState.Idle;
    });
  }

  public isPointerDown(): boolean {
    return this.pointer.state === PointerState.Main;
  }
}
