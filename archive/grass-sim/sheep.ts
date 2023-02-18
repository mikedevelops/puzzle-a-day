import { DisplayObject } from "../../src/engine/objects/displayObject";
import { Vec, vec } from "../engine/vec";
import { randRange } from "../../src/engine/maths";
import {
  DEBUG_SHEEP,
  SHEEP_GRAZE_RATE,
  SHEEP_HP,
  SHEEP_IDLE_WAIT,
  SHEEP_SPEED,
} from "../../src/engine/settings";
import { createStateMachine, State } from "../../src/engine/stateMachine";
import { SheepIdleWaitState } from "./state/sheep/SheepIdleWaitState";
import { renderer } from "./global";
import { randItem } from "../engine/array";
import { SheepGrazeState } from "./state/sheep/SheepGrazeState";
import { SheepMoveState } from "./state/sheep/SheepMoveState";
import { Color } from "../../src/engine/color";
import { DEBUG_LAYER } from "../../src/engine/renderer/renderer";
import { SheepHoverState } from "./state/sheep/SheepHoverState";
import { SafeMap } from "../engine/primitives";
import { Stack } from "./stack";
import { Layer } from "./layer";

let id = 0;

export function createSheep(): Sheep {
  return new Sheep(vec(), randRange(SHEEP_GRAZE_RATE, 0.5), SheepSize.Small);
}

function wait(): number {
  return randRange(SHEEP_IDLE_WAIT, 0.25);
}

enum SheepSize {
  Small,
  Medium,
}

const spriteMap = new SafeMap<SheepSize, string>([
  [SheepSize.Small, "sheep"],
  [SheepSize.Medium, "sheep-2"],
]);

const speedScale = new SafeMap<SheepSize, number>([
  [SheepSize.Small, 1],
  [SheepSize.Medium, 2],
]);

const sizeUpgrades = new SafeMap<SheepSize, number>([
  [SheepSize.Small, 5],
  [SheepSize.Medium, 10],
]);

export class Sheep extends DisplayObject {
  public hp = SHEEP_HP;
  public hunger = 0;
  public stateMachine = createStateMachine(
    new SheepIdleWaitState(this, wait())
  );

  private grazeCount = 0;

  constructor(
    pos: Vec,
    private grazeRate: number,
    public size = SheepSize.Small
  ) {
    super(++id, pos, spriteMap.get(size));
  }

  private getSpeed(): number {
    const scale = speedScale.get(this.size) ?? 1;
    return SHEEP_SPEED * scale;
  }

  public getName(): string {
    return `${this.id} SHEEPY`;
  }

  public getNextState(): State {
    return randItem([
      // new SheepIdleWaitState(this, wait()),
      // new SheepGrazeState(this, this.grazeRate),
      new SheepMoveState(this, this.getSpeed()),
    ]);
  }

  public graze(): void {
    const stack = this.findParent<Stack>(Stack);

    stack.graze();

    if (++this.grazeCount > sizeUpgrades.get(this.size)) {
      this.grazeCount = 0;
      this.grow();
    }
  }

  private grow(): void {
    if (this.size === SheepSize.Small) {
      this.size = SheepSize.Medium;
    }

    this.sprite = spriteMap.get(this.size);
  }

  public update(delta: number) {
    this.stateMachine.update(delta);
  }

  public debug() {
    super.debug();

    this.stateMachine.debug();

    if (DEBUG_SHEEP) {
      renderer.fillText(
        this.stateMachine.getActiveState(),
        this.getWorldPos(),
        Color.red(),
        DEBUG_LAYER
      );
      renderer.fillText(
        `${this.getStack().pos.toString()} ${this.pos.toString()} ${this.getWorldPos().toString()}`,
        this.getWorldPos().add(0, 16),
        Color.red(),
        DEBUG_LAYER
      );
    }
  }

  public getStack(): Stack {
    return this.findParent<Stack>(Stack);
  }

  public getLayer(): Layer {
    return this.getStack().layer;
  }

  public canGraze(): boolean {
    return this.getStack().hasGrass(); // TODO: more checks required here, grass can be in a grazing state
  }

  public moveToStack(p: Vec): void {
    this.getLayer().moveTo(this, p);
  }

  public onPointerOver() {
    this.stateMachine.setState(new SheepHoverState(this));
  }
  public onPointerOut() {
    this.stateMachine.setState(this.getNextState());
  }

  public getNextPos(): Vec {
    return this.getLayer().getRandomPos();
  }
}
