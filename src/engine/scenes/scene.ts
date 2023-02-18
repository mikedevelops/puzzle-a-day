import { collision, debug, input } from "../global";
import { createGrid, Grid } from "../grid";
import { DEBUG_SCENE } from "../settings";
import { GameObject } from "../objects/gameObject";
import { vec, Vec } from "../units/vec";
import { filterDisplayObjects } from "../objects/helperts";
import { DisplayObject } from "../objects/displayObject";
import { PieceManager } from "../../puzzle-a-day/global";

export function createScene(
  name = "main",
  width: number,
  height: number
): Scene {
  return new Scene(name, createGrid(width, height));
}

type ObjFactory = () => GameObject;

export class Scene {
  constructor(public name: string, public grid: Grid) {}

  public reset(): void {
    for (const child of this.grid.getChildren()) {
      // TODO: I don't think the cursor should even be here...
      if (child.getName() === "CURSOR") {
        continue;
      }
      this.grid.remove(child);
    }
    PieceManager.reset();
  }

  public addGameObject(obj: GameObject, pos: Vec = vec()): void {
    this.grid.add(obj, pos);
  }

  public fill(factory: ObjFactory): void {
    this.grid.forEach(({ world, local }) => {
      this.grid.add(factory(), local);
    });
  }

  public update(delta: number): void {
    for (const obj of this.grid.children) {
      obj.update(delta);
    }
  }

  public draw(): void {
    this.grid.draw();
    // TODO (optimize): casting children to new array
    // TODO (refactor): should get children recursive and filter, a GameObject _should_
    //  be able to have display object children, workaround atm is to make grid children
    //  display objects arbitrarily
    // TODO: (optimize): multiple loops to filter & draw display objs
    for (const child of this.grid.children) {
      const objs = filterDisplayObjects(child.getChildrenRecursive());
      if (child instanceof DisplayObject) {
        child.draw();
      }
      for (const dobj of objs) {
        dobj.draw();
      }
    }
  }

  public debug(): void {
    this.grid.debug();

    for (const obj of this.grid.children) {
      obj.debug();
    }

    if (DEBUG_SCENE) {
      const children = this.grid.getChildrenRecursive();
      debug.print("scene", this.name);
      debug.print("objects", children.length);
    }
  }

  public getAllObjects(): void {
    const objs = [];
    for (const c of this.grid.children) {
      objs.push(...c.getChildrenRecursive());
    }
    console.log(objs);
  }
}
