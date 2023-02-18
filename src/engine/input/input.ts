import { vec, Vec } from "../units/vec";
import { Camera } from "../camera/camera";
import { debug } from "../global";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../settings";

export enum PointerState {
  Idle,
  Primary,
  Secondary,
}

export enum KeyInput {
  Rotate = "r",
  Flip = "f",
  Save = "s",
  Load = "l",
}

class Pointer {
  public state = PointerState.Idle;

  public isDown = false;
  public downThisFrame = false;

  constructor(private pos = vec(), private camera: Camera) {}

  public setScreenPos(vec: Vec): void {
    this.pos = vec;
  }

  public getWorldPos(): Vec {
    return this.pos.subv(this.camera.getOffset());
  }

  public getScreenPos(): Vec {
    return this.pos;
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
  public readonly pointer: Pointer;
  private keyDownThisFrame: KeyInput | null = null;

  private keyWasDown: KeyInput | null = null;
  private pointerWasDown = false;

  constructor(public stageOffset: Vec, private camera: Camera) {
    this.pointer = new Pointer(vec(), this.camera);
  }

  public start(): void {
    document.addEventListener("pointermove", (event) => {
      const client = vec(event.clientX, event.clientY);
      this.pointer.setScreenPos(client.subv(this.stageOffset));
    });

    document.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      this.pointer.isDown = true;
      this.pointer.state =
        event.which === 1 ? PointerState.Primary : PointerState.Secondary;
    });

    document.addEventListener("pointerup", (event) => {
      this.pointer.state = PointerState.Idle;
      this.pointer.isDown = false;
      this.pointerWasDown = false;
    });

    document.addEventListener("keydown", (event) => {
      const key = event.key as KeyInput;
      if (!Object.values(KeyInput).includes(key)) {
        return;
      }

      if (this.keyDownThisFrame !== key) {
        this.keyDownThisFrame = key;
      }
    });
  }

  public update(): void {
    this.pointer.downThisFrame = false;

    if (this.pointer.isDown) {
      if (!this.pointerWasDown) {
        this.pointer.downThisFrame = true;
        this.pointerWasDown = true;
      }
    }

    if (!this.keyWasDown) {
      this.keyWasDown = this.keyDownThisFrame;
    } else {
      this.keyDownThisFrame = null;
      this.keyWasDown = null;
    }
  }

  public getKeyDownThisFrame(): KeyInput | null {
    return this.keyDownThisFrame;
  }

  public isPointerDownThisFrame(): boolean {
    return this.pointer.downThisFrame;
  }

  public isPointerDown(): boolean {
    return this.pointer.isDown;
  }

  public debug(): void {
    debug.print(
      "pointer",
      `S: ${this.pointer.getScreenPos()} w: ${this.pointer.getWorldPos()}`
    );
    debug.print("key", this.keyDownThisFrame ?? "null");
    debug.print("pointer", this.isPointerDownThisFrame());
  }
}
