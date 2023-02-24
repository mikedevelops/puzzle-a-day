import { vec, Vec } from "./units/vec";
import { DEBUG_GRID, GRID_UNIT, GRID_WIDTH } from "./settings";
import { debug, input, renderer } from "./global";
import { Color } from "./color";
import { DEBUG_LAYER } from "./renderer/renderer";
import { GameObject } from "./objects/gameObject";
import { Piece } from "../puzzle-a-day/Piece";

export function createGrid(
  width: number,
  height = width,
  pos: Vec = vec(),
  size = GRID_UNIT,
  factory: NodeFactory = (local, world) => ({ local, world })
): Grid {
  return new Grid(width, height, pos, size, factory);
}

export interface Node {
  local: Vec;
  world: Vec;
}

export interface GridNode {
  local: Vec;
  world: Vec;
}

export type NodeFactory = (local: Vec, world: Vec) => GridNode;

let id = 0;

export class Grid extends GameObject {
  private nodes: GridNode[][] = [];

  constructor(
    public width: number,
    public height: number,
    public pos: Vec,
    public size: number,
    private factory: NodeFactory
  ) {
    super(id++, pos);
    this.init();
  }

  protected init() {
    for (let x = 0; x < this.width; x++) {
      if (!this.nodes[x]) this.nodes[x] = [];
      for (let y = 0; y < this.height; y++) {
        const local = vec(x, y);
        this.nodes[x][y] = this.factory(local, this.localToWorld(local));
      }
    }
  }

  public getName(): string {
    return "GRID";
  }

  public localToWorld(p: Vec): Vec {
    return Grid.cartToIso(p.addv(this.pos)).multiply(this.size);
  }

  public draw(): void {
    renderer.path(
      [
        this.localToWorld(vec()).sub(0, this.size / 2),
        this.localToWorld(vec(this.width, 0)).sub(0, this.size / 2),
        this.localToWorld(vec(this.width, this.height)).sub(0, this.size / 2),
        this.localToWorld(vec(0, this.height)).sub(0, this.size / 2),
        this.localToWorld(vec()).sub(0, this.size / 2),
      ],
      Color.red(),
      4,
      DEBUG_LAYER
    );
  }

  public debug(): void {
    if (!DEBUG_GRID) {
      return;
    }

    const pos = this.worldToLocalSnap(input.pointer.getWorldPos());

    debug.print("GRID", !pos ? "OOB" : pos.local.toString());

    this.forEach(({ local, world }) => {
      renderer.drawISoRect(
        // world.add(0, this.size / 2),
        world,
        this.size,
        this.size,
        Color.red(0.25),
        false,
        vec(0, -this.size / 2),
        2,
        DEBUG_LAYER
      );
      renderer.fillRect(world, this.size / 4, this.size / 4, Color.green(0.5));
      renderer.fillText(
        `${local.x},${local.y}`,
        world,
        Color.red(),
        this.size,
        this.size
      );
    });

    const snapped = this.worldToLocalSnap(
      Vec.from(input.pointer.getWorldPos())
    );

    if (snapped) {
      const { world } = snapped;
      renderer.fillRect(world, 8, 8, Color.white(), vec(), DEBUG_LAYER);
    }
  }

  public worldToLocalUnsafe(worldPos: Vec): Vec {
    const snap = this.worldToLocalSnap(worldPos, false);
    return snap!.local;
  }

  public worldToLocalSnap(v: Vec, safe = true): Node | null {
    const local = Grid.isoToCart(v).divide(this.size).round();

    if (safe && !this.contains(local)) {
      return null;
    }

    return {
      local: local,
      world: this.localToWorld(local),
    };
  }

  public getCenter(): Vec {
    return this.pos.sub(0, Math.floor(this.height / 2) * this.size);
  }

  private contains(p: Vec): boolean {
    let cx = false,
      cy = false;

    // TODO: optimise
    this.forEach(({ local }) => {
      if (local.x == p.x) cx = true;
      if (local.y == p.y) cy = true;
      if (cx && cy) return;
    });

    return cx && cy;
  }

  public forEach(cb: (node: GridNode) => void): void {
    this.nodes.forEach((row) => {
      row.forEach((node) => {
        cb(node);
      });
    });
  }

  static cartToIso(c: Vec): Vec {
    const i = Vec.from(c);
    i.x = c.x - c.y;
    i.y = (c.x + c.y) / 2;
    return i;
  }

  static isoToCart(i: Vec): Vec {
    const c = Vec.from(i);
    c.x = (2 * i.y + i.x) / 2;
    c.y = (2 * i.y - i.x) / 2;
    return c;
  }

  public add(o: GameObject, localPos = vec()) {
    super.add(o, this.localToWorld(localPos));
  }

  // public getPathFindingGrid(): boolean[][] {
  //   const grid: boolean[][] = [];
  //   const constructionMatrix = construction.getConstructionMatrix();
  //
  //   this.forEach((node) => {
  //     const { local: pos } = node;
  //     if (grid[pos.x] === undefined) {
  //       grid[pos.x] = [];
  //     }
  //
  //     let walkable = true;
  //
  //     if (
  //       constructionMatrix[pos.x] &&
  //       constructionMatrix[pos.x][pos.y] !== null
  //     ) {
  //       walkable = false;
  //     }
  //
  //     grid[pos.x][pos.y] = walkable;
  //   });
  //   return grid;
  // }
}
