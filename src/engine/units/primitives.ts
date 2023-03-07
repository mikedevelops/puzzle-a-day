export class SafeMap<T, K> {
  private map: Map<T, K>;

  constructor(entries: [T, K][] = []) {
    this.map = new Map(entries);
  }

  public set(k: T, v: K): void {
    this.map.set(k, v);
  }

  public get(k: T): K {
    if (!this.map.has(k)) {
      throw new Error(`Attempted to access unset key "${k}" in safe map!`);
    }
    return this.map.get(k)!;
  }
}
