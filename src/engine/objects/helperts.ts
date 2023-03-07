import { GameObject } from "./gameObject";
import { DisplayObject } from "./displayObject";
import { UIObject } from "../../puzzle-a-day/ui/UIObject";

export function filterDisplayObjects(objs: GameObject[]): DisplayObject[] {
  const t: DisplayObject[] = [];
  for (const o of objs) {
    if (o instanceof DisplayObject) {
      t.push(o);
    }
  }
  return t;
}

export function filterUIObjects(objs: GameObject[]): UIObject[] {
  const t: UIObject[] = [];
  for (const o of objs) {
    if (o instanceof UIObject) {
      t.push(o);
    }
  }
  return t;
}
