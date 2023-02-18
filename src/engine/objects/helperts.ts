import { GameObject } from "./gameObject";
import { DisplayObject } from "./displayObject";

export function filterDisplayObjects(objs: GameObject[]): DisplayObject[] {
  const t: DisplayObject[] = [];
  for (const o of objs) {
    if (o instanceof DisplayObject) {
      t.push(o);
    }
  }
  return t;
}
