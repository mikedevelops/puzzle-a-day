import { createGrass, Grass } from "./grass";
import { Vec } from "../engine/vec";
import { DisplayObject } from "../engine/displayObject";
import { randRange } from "../engine/maths";
import { DEBUG_STACKS, GROW_RATE, MAX_STACK_SIZE } from "../engine/settings";
import { Layer } from "./layer";
import { renderer } from "./global";
import { Color } from "../engine/color";
import { Sheep } from "./sheep";
import { FlashState } from "./state/FlashState";

export function createStack(layer: Layer, pos: Vec): Stack {
  const growRate = randRange(GROW_RATE, 0.25);
  return new Stack(layer, pos, growRate);
}

const unsupported = (o: DisplayObject) =>
  new Error(`Unsupported obj "${o.getName()}" in Stack!`);

export class Stack {
  public grass = new Set<Grass>();
  public sheep = new Set<Sheep>();

  private lastGrow = Date.now();

  constructor(public layer: Layer, public pos: Vec, private growRate: number) {}

  public add(o: DisplayObject, setPos = true): void {
    // TODO: is this lame?
    if (setPos) {
      o.pos = this.pos.clone();
    }

    o.parent = this.layer;

    if (o instanceof Grass) {
      this.grass.add(o);
      return;
    }

    if (o instanceof Sheep) {
      this.sheep.add(o);
      return;
    }

    throw unsupported(o);
  }

  public indexOf(o: DisplayObject): number {
    if (o instanceof Grass) {
      return [...this.grass].indexOf(o);
    }

    if (o instanceof Sheep) {
      return this.grass.size;
    }

    throw unsupported(o);
  }

  public remove(o: DisplayObject): void {
    if (o instanceof Grass) {
      this.grass.delete(o);
      return;
    }

    if (o instanceof Sheep) {
      this.sheep.delete(o);
      return;
    }

    throw unsupported(o);
  }

  public has(o: DisplayObject): boolean {
    if (o instanceof Grass) {
      return this.grass.has(o);
    }

    if (o instanceof Sheep) {
      return this.sheep.has(o);
    }

    throw unsupported(o);
  }

  public grassLength(): number {
    return this.grass.size;
  }

  public update(d: number): void {
    for (const o of [...this.sheep, ...this.grass]) {
      o.update(d);
    }
  }

  public draw(): void {
    for (const g of this.grass) {
      g.draw();
    }

    for (const s of this.sheep) {
      s.draw();
    }
  }

  public debug(): void {
    for (const o of [...this.grass, ...this.sheep]) {
      o.debug();
    }

    if (DEBUG_STACKS) {
      const growDelta = this.growRate - (Date.now() - this.lastGrow);
      const pos = this.layer.getWorldPos(this.pos);
      if (this.grassLength() < MAX_STACK_SIZE) {
        renderer.fillText(`${growDelta}ms`, pos, Color.red());
      }
    }
  }

  public getTopOfStack(): Grass | null {
    if (!this.grass.size) {
      return null;
    }

    return [...this.grass].pop()!; // TODO: could this be a nicer type?
  }

  public shouldGrow(): boolean {
    return (
      this.grassLength() < MAX_STACK_SIZE &&
      Date.now() - this.lastGrow > this.growRate
    );
  }

  public grow(): void {
    this.layer.add(createGrass(), this.pos);
    this.resetGrowState();
  }

  public graze(): void {
    const grass = this.getTopOfStack();
    if (!grass) {
      return;
    }
    grass.stateMachine.setState(
      new FlashState(grass, grass.stateMachine.state, () => {
        grass.destroy();
        this.resetGrowState();
      })
    );
  }

  private resetGrowState(): void {
    this.lastGrow = Date.now();
  }

  public hasSheep(): boolean {
    return this.sheep.size > 0;
  }
}
