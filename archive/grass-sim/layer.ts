import { Grid } from "../../src/engine/grid";
import { GRID_UNIT } from "../../src/engine/settings";
import { vec, Vec } from "../engine/vec";
import { Cursor } from "../../src/engine/cursor";
import { debug } from "./global";
import { createStack, Stack } from "./stack";
import { randItem } from "../engine/array";
import { GameObject } from "../../src/engine/objects/gameObject";
import { randVec } from "../../src/engine/maths";
import {
  DisplayObject,
  DisplayObjectFactory,
} from "../../src/engine/objects/displayObject";
import { filterDisplayObjects } from "../../src/engine/objects/helperts";

export function createLayer(
  width: number,
  height: number,
  pos: Vec,
  index: number,
  size = GRID_UNIT
): Layer {
  return new Layer(width, height, pos, index, size);
}

export class Layer extends Grid {
  constructor(
    width: number,
    height: number,
    pos: Vec,
    public index: number,
    size = GRID_UNIT
  ) {
    const nodeFactory = (local: Vec, world: Vec) => ({ local, world });
    super(width, height, pos, size, nodeFactory);
  }

  public getDisplayObjects(): DisplayObject[] {
    const children = filterDisplayObjects([...this.children.values()]); // TODO: this copy is daft
    return children;
  }

  public draw(): void {
    const objs = this.getDisplayObjects();
    for (const obj of objs) {
      obj.draw();
    }
  }

  public debug(): void {
    const objs = [...this.children.values()];
    for (const obj of objs) {
      obj.debug();
    }
  }

  public fill(objFactory: DisplayObjectFactory): void {
    this.forEach((node) => {
      const o = objFactory(node.world);
      this.add(o);
    });
  }
}

// export class Layer extends Grid {
//   private cursor: Cursor | null = null;
//   private availableNodes: Vec[] = [];
//   private stacks: Stack[][] = [];
//
//   constructor(
//     width: number,
//     height: number,
//     pos: Vec,
//     size: number,
//     public index: number,
//     public offset: Vec
//   ) {
//     const node = (local: Vec, world: Vec) => ({ local, world });
//     super(width, height, node, pos, size);
//
//     for (let x = 0; x < width; x++) {
//       if (!this.stacks[x]) this.stacks[x] = [];
//       for (let y = 0; y < height; y++) {
//         if (!this.stacks[x][y]) {
//           const pos = vec(x, y);
//           this.stacks[x][y] = createStack(pos, this);
//         }
//       }
//     }
//   }
//
//   public getStack(o: GameObject): Stack {
//     let s: Stack | null = null;
//
//     // TODO: more weirdness, why are we calling getStack() _on_ a stack...
//     if (o instanceof Stack) {
//       return o;
//     }
//
//     this.forEachStack((pos, stack, breakout) => {
//       if (stack.has(o)) {
//         s = stack;
//         breakout();
//       }
//     });
//
//     if (!s) {
//       throw new Error(`Could not find "${o.getName()}" in Stacks!`);
//     }
//
//     return s;
//   }
//
//   private getStackAt(pos: Vec): Stack {
//     if (!this.stacks[pos.x] || !this.stacks[pos.x][pos.y]) {
//       throw new Error(`Attempted to access stack at ${pos.toString()}`);
//     }
//     return this.stacks[pos.x][pos.y];
//   }
//
//   public grow(): void {
//     this.forEachStack((pos, stack) => {
//       if (stack.shouldGrow()) {
//         stack.grow();
//       }
//     });
//   }
//
//   /**
//    * Get adjacent stacks at N,E,S,W
//    */
//   private getNeighbourStacks(p: Vec): Stack[] {
//     const n: Stack[] = [];
//     if (this.hasStack(p.addv(Vec.north()))) {
//       n.push(this.getStackAt(p.addv(Vec.north())));
//     }
//     if (this.hasStack(p.addv(Vec.east()))) {
//       n.push(this.getStackAt(p.addv(Vec.east())));
//     }
//     if (this.hasStack(p.addv(Vec.south()))) {
//       n.push(this.getStackAt(p.addv(Vec.south())));
//     }
//     if (this.hasStack(p.addv(Vec.west()))) {
//       n.push(this.getStackAt(p.addv(Vec.west())));
//     }
//     return n;
//   }
//
//   public getNextStack(o: GameObject): Stack {
//     const s = this.getStack(o);
//     const n = [...this.getNeighbourStacks(o.pos), s].filter((s) => {
//       return !s.hasSheep();
//     });
//     if (!n.length) {
//       return s;
//     }
//     return randItem(n);
//   }
//
//   public moveTo(o: GameObject, p: Vec): void {
//     const current = o.findParent<Stack>(Stack);
//     const next = this.getStackAt(p);
//
//     current.remove(o);
//     next.add(o, false);
//   }
//
//   private hasStack(p: Vec): boolean {
//     return (
//       this.stacks[p.x] !== undefined && this.stacks[p.x][p.y] !== undefined
//     );
//   }
//
//   private forEachStack(
//     cb: (pos: Vec, stack: Stack, breakout: () => void) => void
//   ): void {
//     let breakout = false;
//     const cancel = () => {
//       breakout = true;
//     };
//     for (let x = 0; x < this.width; x++) {
//       if (breakout) break;
//       for (let y = 0; y < this.height; y++) {
//         if (breakout) break;
//         const p = vec(x, y);
//         if (!this.stacks[x][y]) {
//           throw new Error(`Could not get stack at ${p.toString()}`);
//         }
//
//         cb(p, this.stacks[x][y], cancel);
//       }
//     }
//   }
//
//   public add(o: GameObject, p: Vec): void {
//     const s = this.getStackAt(p);
//     o.parent = s;
//     s.add(o);
//   }
//
//   public remove(o: GameObject): void {
//     const [sp] = this.getStackIndex(o);
//     const stack = this.getStackAt(sp);
//
//     stack.remove(o);
//     this.availableNodes.push(o.pos.clone());
//   }
//
//   // TODO: this method is complicated and weird...
//   private getStackIndex(obj: GameObject): [stack: Vec, stackIndex: number] {
//     let stackIndex = -1;
//     let stackPos: null | Vec = null;
//
//     this.forEachStack((pos, s, breakout) => {
//       if (s.has(obj)) {
//         stackPos = pos;
//         stackIndex = s.indexOf(obj);
//         breakout();
//         return;
//       }
//     });
//
//     if (stackIndex === -1 || stackPos === null) {
//       throw new Error(
//         `Could not find obj ${obj.getName()} in stacks, stack: ${
//           stackPos ? (stackPos as Vec).toString() : "NULL"
//         }, stack index: ${stackIndex}`
//       );
//     }
//
//     return [stackPos, stackIndex];
//   }
//
//   public update(delta: number): void {
//     // this.grow();
//
//     this.forEachStack((pos, stack) => {
//       stack.update(delta);
//     });
//
//     this.cursor?.update();
//   }
//
//   public draw(): void {
//     this.forEachStack((pos, stack) => {
//       stack.draw();
//     });
//
//     this.cursor?.draw();
//   }
//
//   public debug(): void {
//     super.debug();
//
//     this.forEachStack((pos, stack) => {
//       stack.debug();
//     });
//
//     this.cursor?.debug();
//
//     debug.print("layer", this.index);
//   }
//
//   public fill(factory: (...args: any[]) => GameObject): void {
//     this.forEachStack((pos, stack) => {
//       this.add(factory(pos), pos);
//     });
//   }
//
//   public getRandomPos(): Vec {
//     const x = this.stacks.indexOf(randItem(this.stacks));
//     const y = this.stacks[x].indexOf(randItem(this.stacks[x]));
//     return vec(x, y);
//   }
// }
