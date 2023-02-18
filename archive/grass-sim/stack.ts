import { createGrass, Grass } from "./grass";
import { vec, Vec } from "../engine/vec";
import { randRange } from "../../src/engine/maths";
import {
  DEBUG_STACKS,
  GRID_UNIT,
  GROW_RATE,
  MAX_STACK_SIZE,
} from "../../src/engine/settings";
import { renderer } from "./global";
import { Color } from "../../src/engine/color";
import { Sheep } from "./sheep";
import { FlashState } from "./state/FlashState";
import { createCollider } from "../../src/engine/collider";
import { GameObject } from "../../src/engine/objects/gameObject";
import { Layer } from "./layer";

export function createStack(pos: Vec, layer: Layer): Stack {
  const growRate = randRange(GROW_RATE, 0.25);
  const collider = createCollider(
    [vec(0, 0), vec(GRID_UNIT, 24), vec(0, 48), vec(-GRID_UNIT, 24), vec(0, 0)],
    vec(0, -24)
  );
  const s = new Stack(pos, growRate, layer);
  s.addCollider(collider);
  return s;
}

const unsupported = (o: GameObject) =>
  new Error(`Unsupported obj "${o.getName()}" in Stack!`);

let id = 0;

export class Stack extends GameObject {
  public grass = new Set<Grass>();
  public sheep = new Set<Sheep>();

  private lastGrow = Date.now();

  constructor(pos: Vec, private growRate: number, public layer: Layer) {
    super(id++, pos);
  }

  public getName(): string {
    return `stack ${this.id} ${this.pos.toString()}`;
  }

  public add(o: GameObject, snap = true): void {
    if (snap) {
      o.pos = this.pos.clone();
    }

    o.parent = this;

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

  public indexOf(o: GameObject): number {
    if (o instanceof Grass) {
      return [...this.grass].indexOf(o);
    }

    if (o instanceof Sheep) {
      return this.grass.size;
    }

    throw unsupported(o);
  }

  public remove(o: GameObject): void {
    o.parent = null;

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

  public has(o: GameObject): boolean {
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

  private getStackIndex(o: GameObject): number {
    let index = 0;

    if (o instanceof Grass) {
      index = [...this.grass].indexOf(o);
    }

    if (o instanceof Sheep) {
      index = [...this.sheep].indexOf(o) + this.grass.size; // sheepies live on top of grass
    }

    if (index === -1) {
      // attempted to get world pos of an obj not in the stack
      unsupported(o);
    }

    return index;
  }

  public getWorldPos(o: GameObject | Vec = this): Vec {
    // TODO: this offset needs to be relative to the size of the thing in the stack...
    const stackOffset = 8; // TODO: magic
    const p = o instanceof Vec ? o : o.pos;
    return this.layer.vecToWorld(p).sub(0, this.getStackIndex(o) * stackOffset);
  }

  public update(d: number): void {
    for (const o of [...this.sheep, ...this.grass]) {
      o.update(d);
    }
  }

  public draw(): void {
    const p = this.getWorldPos();

    // TODO: optimisation, could probably skip drawing this if we have grass
    renderer.renderSprite("ground", p, 0);

    for (const g of this.grass) {
      g.draw(this.getStackIndex(g));
    }

    for (const s of this.sheep) {
      s.draw(this.getStackIndex(s));
    }
  }

  public debug(): void {
    super.debug();

    for (const o of [...this.grass, ...this.sheep]) {
      o.debug();
    }

    if (DEBUG_STACKS) {
      const growDelta = this.growRate - (Date.now() - this.lastGrow);
      const pos = this.layer.vecToWorld(this.pos);
      if (this.grassLength() < MAX_STACK_SIZE) {
        renderer.fillText(`${growDelta}ms`, pos, Color.red());
      }
    }
  }

  private getTopEntities(): [Sheep | null, Grass | null] {
    // TODO: duplicating these arrays makes using Set more expensive than it needs to be
    const sheep = [...this.sheep].pop() ?? null;
    const grass = [...this.grass].pop() ?? null;
    return [sheep, grass];
  }

  public shouldGrow(): boolean {
    return (
      this.grassLength() < MAX_STACK_SIZE &&
      Date.now() - this.lastGrow > this.growRate
    );
  }

  public grow(): void {
    this.add(createGrass(this));
    this.resetGrowState();
    this.updateCollider();
  }

  public graze(): void {
    const [_, grass] = this.getTopEntities();

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

  public hasGrass(): boolean {
    return this.grass.size > 0;
  }

  private updateCollider(): void {
    if (!this.collider) {
      return;
    }

    // TODO: all these magic numbers will break when the scale changes...
    const height = this.grass.size * 8;
    this.collider.path = [
      vec(0, -height),
      vec(GRID_UNIT, -height + 24),
      vec(GRID_UNIT, -height + 24 + height),
      vec(0, -height + 24 + height + 24),
      vec(-GRID_UNIT, -height + 24 + height),
      vec(-GRID_UNIT, -height + 24),
      vec(0, -height),
    ];
  }

  public onPointerOver(): void {
    const [sheep, grass] = this.getTopEntities();
    if (sheep) {
      sheep.onPointerOver();
      return;
    }
    if (grass) {
      grass.onPointerOver();
      return;
    }
  }

  public onPointerDown(): void {
    const [sheep, grass] = this.getTopEntities();
    if (sheep) {
      sheep.onPointerDown();
      return;
    }
    if (grass) {
      grass.onPointerDown();
      return;
    }
  }

  public onPointerOut() {
    const [sheep, grass] = this.getTopEntities();
    if (sheep) {
      sheep.onPointerOut();
      return;
    }
    if (grass) {
      grass.onPointerOut();
      return;
    }
  }
}
