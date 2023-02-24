import { Collider } from "../collider";
import { vec, Vec } from "../units/vec";
import { StateMachine } from "../stateMachine";
import { DEBUG_COLLIDERS, DEBUG_STATE } from "../settings";
import { Grid } from "../grid";

export interface Parent {
  getWorldPos(): Vec;
  remove(obj: GameObject): void;
}

export type Handler = (obj: GameObject) => void;

export abstract class GameObject {
  public offset = vec();
  public parent: GameObject | null = null;
  public children: Set<GameObject> = new Set();
  public collider: Collider | null = null;
  public enabled = true;

  private handlers = new Map<string, Handler[]>([["onPointerDown", []]]);

  constructor(
    public id: number,
    public pos: Vec,
    public stateMachine: StateMachine | null = null
  ) {}

  public abstract getName(): string;

  public isEnabled(): boolean {
    return this.enabled;
  }

  public getState(): string {
    if (!this.stateMachine) {
      throw new Error(
        `Attempted to access state of obj with no state machine ${this.getName()}`
      );
    }

    return this.stateMachine.getActiveState().getName();
  }

  public update(delta: number): void {
    this.stateMachine?.update(delta);
    for (const c of this.children.values()) {
      c.update(delta);
    }
  }

  public addCollider(c: Collider) {
    this.collider = c;
    this.collider.obj = this;
    this.collider.enable();
  }

  public removeCollider() {
    this.collider?.destroy();
    this.collider = null;
  }

  public getWorldPos(): Vec {
    let p = this.pos;

    if (this.parent) {
      p = p.addv(this.parent.getWorldPos());
    }

    return p;
  }

  public destroy(): void {
    this.parent?.remove(this);
    this.collider?.destroy();
  }

  public debug(): void {
    if (DEBUG_COLLIDERS) {
      this.collider?.debug();
    }

    if (DEBUG_STATE) {
      this.stateMachine?.debug();
    }
  }

  public add(o: GameObject, worldPos?: Vec): void {
    if (o.parent) {
      o.parent.remove(o);
    }

    o.parent = this;
    if (worldPos) {
      o.setPos(worldPos);
    }
    this.children.add(o);
  }

  public setPos(worldPos: Vec): void {
    this.pos = worldPos;
  }

  public hasChild(o: GameObject): boolean {
    return this.children.has(o);
  }

  public setChildren(...children: GameObject[]): void {
    this.children = new Set();
    for (const c of children) {
      this.add(c);
    }
  }

  public remove(o: GameObject, parent: GameObject | null = null): void {
    this.children.delete(o);
    o.parent = parent;
  }

  public getChildrenRecursive(): GameObject[] {
    const children = [...this.children.values()];
    for (const c of this.children.values()) {
      children.push(...c.getChildrenRecursive());
    }
    return children;
  }

  public getChildren(): GameObject[] {
    return [...this.children.values()];
  }

  public getParentsRecursive(
    parent: GameObject | null,
    parents: GameObject[] = []
  ): GameObject[] {
    if (!parent) {
      return parents;
    }

    return this.getParentsRecursive(parent.parent, [...parents, parent]);
  }

  public registerHandler(event: string, handler: Handler): void {
    const e = this.handlers.get(event);
    if (e === undefined) {
      throw new Error(`Cannot register handler, unrecognised event "${event}"`);
    }
    e.push(handler);
  }

  public removeHandler(event: string, handler: Handler): void {
    const e = this.handlers.get(event);
    if (e === undefined) {
      throw new Error(`Cannot register handler, unrecognised event "${event}"`);
    }
    this.handlers.set(
      event,
      e.filter((h) => h !== handler)
    );
  }

  public onPointerDown(): void {
    // TODO (cleanup): lazy types and implementation
    for (const h of this.handlers.get("onPointerDown")!) {
      h(this);
    }
  }
  public onPointerUp(): void {}
  public onPointerOver(): void {}
  public onPointerOut(): void {}

  // TODO (optimize): cache the grid
  public getGrid(): Grid {
    const parents = this.getParentsRecursive(this.parent);
    const err = new Error(
      `Cannot get grid, it was not the direct parent of ${this.getName()}`
    );

    if (!parents.length) {
      throw err;
    }

    for (const p of parents) {
      if (p instanceof Grid) {
        return p;
      }
    }

    throw err;
  }
}
