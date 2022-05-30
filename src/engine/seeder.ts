import { Grass } from "../grass-sim/grass";
import type { Layer } from "../grass-sim/layer";

interface Seeder<T> {
  seed: (layer: Layer, ...args: any[]) => T | null;
}
