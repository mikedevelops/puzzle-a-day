import { Grid } from "../engine/grid";
import { GRID_UNIT, MAX_STACK_SIZE, SPRITE_SCALE } from "../engine/settings";
import { vec, Vec } from "../engine/vec";
import { DisplayObject, DisplayObjectFactory } from "../engine/displayObject";
import { Cursor } from "../engine/cursor";
import { createGrass } from "./grass";
import { debug, renderer } from "./global";
import { createStack, Stack } from "./stack";
import { randItem } from "../engine/array";

export function createLayer(
  width: number,
  height: number,
  pos: Vec,
  index: number,
  size = GRID_UNIT
): Layer {
  const offset = vec(0, -32);
  return new Layer(width, height, pos, size, index, offset);
}

export class Layer extends Grid {
  private cursor: Cursor | null = null;
  private availableNodes: Vec[] = [];
  private stacks: Stack[][] = [];

  constructor(
    width: number,
    height: number,
    pos: Vec,
    size: number,
    public index: number,
    public offset: Vec
  ) {
    super(width, height, pos, size);

    for (let x = 0; x < width; x++) {
      if (!this.stacks[x]) this.stacks[x] = [];
      for (let y = 0; y < height; y++) {
        if (!this.stacks[x][y]) {
          const pos = vec(x, y);
          const stack = createStack(this, pos);
          this.stacks[x][y] = stack;
        }
      }
    }
  }

  public getStack(o: DisplayObject): Stack {
    let s: Stack | null = null;
    this.forEachStack((pos, stack, breakout) => {
      if (stack.has(o)) {
        s = stack;
        breakout();
      }
    });

    if (!s) {
      throw new Error(`Could not find "${o.getName()}" in Stacks!`);
    }

    return s;
  }

  private getStackAt(pos: Vec): Stack {
    if (!this.stacks[pos.x] || !this.stacks[pos.x][pos.y]) {
      throw new Error(`Attempted to access stack at ${pos.toString()}`);
    }
    return this.stacks[pos.x][pos.y];
  }

  public grow(): void {
    this.forEachStack((pos, stack) => {
      if (stack.shouldGrow()) {
        stack.grow();
      }
    });
  }

  /**
   * Get adjacent stacks at N,E,S,W
   */
  private getNeighbourStacks(p: Vec): Stack[] {
    const n: Stack[] = [];
    if (this.hasStack(p.addv(Vec.north()))) {
      n.push(this.getStackAt(p.addv(Vec.north())));
    }
    if (this.hasStack(p.addv(Vec.east()))) {
      n.push(this.getStackAt(p.addv(Vec.east())));
    }
    if (this.hasStack(p.addv(Vec.south()))) {
      n.push(this.getStackAt(p.addv(Vec.south())));
    }
    if (this.hasStack(p.addv(Vec.west()))) {
      n.push(this.getStackAt(p.addv(Vec.west())));
    }
    return n;
  }

  public getNextStack(o: DisplayObject): Stack {
    const s = this.getStack(o);
    const n = [...this.getNeighbourStacks(o.pos), s].filter((s) => {
      return !s.hasSheep();
    });
    if (!n.length) {
      return s;
    }
    return randItem(n);
  }

  public moveTo(o: DisplayObject, s: Stack): void {
    const current = this.getStack(o);
    current.remove(o);
    s.add(o, false);
  }

  public graze(p: Vec): void {
    const s = this.getStackAt(p);
    s.graze();
  }

  private hasStack(p: Vec): boolean {
    return (
      this.stacks[p.x] !== undefined && this.stacks[p.x][p.y] !== undefined
    );
  }

  private forEachStack(
    cb: (pos: Vec, stack: Stack, breakout: () => void) => void
  ): void {
    let breakout = false;
    const cancel = () => {
      breakout = true;
    };
    for (let x = 0; x < this.width; x++) {
      if (breakout) break;
      for (let y = 0; y < this.height; y++) {
        if (breakout) break;
        const p = vec(x, y);
        if (!this.stacks[x][y]) {
          throw new Error(`Could not get stack at ${p.toString()}`);
        }

        cb(p, this.stacks[x][y], cancel);
      }
    }
  }

  public add(o: DisplayObject, p: Vec): void {
    const s = this.getStackAt(p);
    s.add(o);
  }

  public remove(o: DisplayObject): void {
    const [sp] = this.getStackIndex(o);
    const stack = this.getStackAt(sp);

    stack.remove(o);
    this.availableNodes.push(o.pos.clone());
  }

  // TODO: this method is complicated and weird...
  private getStackIndex(obj: DisplayObject): [stack: Vec, stackIndex: number] {
    let stackIndex = -1;
    let stackPos: null | Vec = null;

    this.forEachStack((pos, s, breakout) => {
      if (s.has(obj)) {
        stackPos = pos;
        stackIndex = s.indexOf(obj);
        breakout();
        return;
      }
    });

    if (stackIndex === -1 || stackPos === null) {
      throw new Error(
        `Could not find obj ${obj.getName()} in stacks, stack: ${
          stackPos ? (stackPos as Vec).toString() : "NULL"
        }, stack index: ${stackIndex}`
      );
    }

    return [stackPos, stackIndex];
  }

  public getWorldPos(e: DisplayObject | Vec): Vec {
    let offset = vec();
    let p: Vec;
    if (e instanceof DisplayObject) {
      const [_, stackIndex] = this.getStackIndex(e);
      // TODO: 8 is magic'ish
      offset = offset.add(0, stackIndex * (SPRITE_SCALE + 4));
      p = e.pos;
    } else {
      p = e;
    }

    return super.getWorldPos(p).subv(offset);
  }

  public update(delta: number): void {
    this.grow();

    this.forEachStack((pos, stack) => {
      stack.update(delta);
    });

    this.cursor?.update();
  }

  public draw(): void {
    this.forEachStack((pos, stack) => {
      renderer.renderSprite("ground", this.getWorldPos(pos), 0);
      stack.draw();
    });

    this.cursor?.draw();
  }

  public debug(): void {
    super.debug();

    this.forEachStack((pos, stack) => {
      stack.debug();
    });

    this.cursor?.debug();

    debug.print("layer", this.index);
  }

  public fill(factory: DisplayObjectFactory): void {
    this.forEachStack((pos, stack) => {
      this.add(factory(pos), pos);
    });
  }
}
