import { randInt } from "./maths";

export function randItem<T>(list: T[]): T {
  if (list.length === 0) {
    throw new Error("Attempted to get rand item of empty list!");
  }
  return list[randInt(0, list.length)];
}

export function removeItem<T>(i: T, list: T[]): T[] {
  return list.filter((n) => n !== i);
}
