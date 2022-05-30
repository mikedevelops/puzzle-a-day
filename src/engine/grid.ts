import { vec, Vec } from "./vec";
import { DEBUG_GRID_NODES, GRID_UNIT } from "./settings";
import { camera, input, renderer } from "../grass-sim/global";
import { Color, red, white } from "./color";
import { DEBUG_LAYER } from "./renderer";
import { DisplayObject } from "./displayObject";

export function createGrid(
  width: number,
  height = width,
  pos: Vec = vec(),
  size = GRID_UNIT
): Grid {
  return new Grid(width, height, pos, size);
}

export interface Node {
  local: Vec;
  world: Vec;
}

export class Grid {
  private nodes: Node[][] = [];

  constructor(
    public width: number,
    public height: number,
    public pos: Vec,
    public size: number
  ) {
    for (let x = 0; x < width; x++) {
      if (!this.nodes[x]) this.nodes[x] = [];
      for (let y = 0; y < height; y++) {
        const local = vec(x, y);
        this.nodes[x][y] = {
          local: local,
          world: this.cartToIso(this.localToWorld(local)),
        };
      }
    }
  }

  public getWorldPos(e: Vec | DisplayObject): Vec {
    const p = e instanceof DisplayObject ? e.pos : e;
    return this.localToWorld(this.cartToIso(p.addv(this.pos)));
  }

  private localToWorld(v: Vec): Vec {
    return v.multiply(this.size);
  }

  public debug(): void {
    if (!DEBUG_GRID_NODES) {
      return;
    }

    this.forEach((local, world) => {
      renderer.fillText(
        local.toString(),
        world.add(0, 24),
        Color.red(),
        DEBUG_LAYER
      );
      renderer.fillText(
        world.addv(camera.getOffset()).toString(),
        world.add(0, 36),
        Color.red(),
        DEBUG_LAYER
      );
      renderer.fillRect(world, 8, 8, Color.red(), DEBUG_LAYER);
    });

    const snapped = this.snapToGrid(Vec.from(input.pointer));

    if (snapped) {
      const { world } = snapped;
      renderer.fillRect(world, 8, 8, Color.white(), DEBUG_LAYER);
    }

    renderer.line(
      [
        this.getWorldPos(vec()).sub(0, this.size / 2),
        this.getWorldPos(vec(this.width, 0)).sub(0, this.size / 2),
        this.getWorldPos(vec(this.width, this.height)).sub(0, this.size / 2),
        this.getWorldPos(vec(0, this.height)).sub(0, this.size / 2),
        this.getWorldPos(vec()).sub(0, this.size / 2),
      ],
      Color.white(),
      DEBUG_LAYER
    );
  }

  public snapToGrid(v: Vec): Node | null {
    const local = this.isoToCart(v).divide(this.size).round();

    if (!this.contains(local)) {
      return null;
    }

    return {
      local: local,
      world: this.localToWorld(this.cartToIso(local)),
    };
  }

  public getCenter(): Vec {
    return this.pos.sub(0, Math.floor(this.height / 2) * this.size);
  }

  private contains(p: Vec): boolean {
    let cx = false,
      cy = false;

    // TODO: optimise
    this.forEach((local) => {
      if (local.x == p.x) cx = true;
      if (local.y == p.y) cy = true;
      if (cx && cy) return;
    });

    return cx && cy;
  }

  public forEach(cb: (local: Vec, world: Vec) => void): void {
    this.nodes.forEach((row) => {
      row.forEach(({ local, world }) => {
        cb(local, world);
      });
    });
  }

  private cartToIso(c: Vec): Vec {
    const i = Vec.from(c);
    i.x = c.x - c.y;
    i.y = (c.x + c.y) / 2;
    return i;
  }

  private isoToCart(i: Vec): Vec {
    const c = Vec.from(i);
    c.x = (2 * i.y + i.x) / 2;
    c.y = (2 * i.y - i.x) / 2;
    return c;
  }
}
