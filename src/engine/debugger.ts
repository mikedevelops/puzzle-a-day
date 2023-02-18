import { green } from "./color";
import { vec } from "./units/vec";
import { CTX } from "./canvas";
import { DEBUG } from "./settings";
import { mean } from "./maths";

const FONT_SIZE = 12;

export function createDebugger(ctx: CTX): Debugger {
  return new Debugger(ctx);
}

interface DeferDraw {
  fn: () => void;
}

interface DebugValue {
  toString(): string;
}

interface SampleCache {
  size: number;
  values: number[];
  lastSampleValue: number;
}

class Debugger {
  private y = 0;
  private padding = vec(16, 28);
  private size = FONT_SIZE;
  private style = `${this.size}px monospace`;

  private queue = new Set<DeferDraw>();
  private sampleCache = new Map<string, SampleCache>();

  constructor(private ctx: CTX) {}

  private enqueue(dd: DeferDraw): void {
    this.queue.add(dd);
  }

  public print(
    label: string,
    value: DebugValue,
    color: string = green()
  ): void {
    this.enqueue({
      fn: () => {
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.fillText(
          `${label}: ${value.toString()}`,
          this.padding.x,
          this.padding.y + this.y
        );
        this.ctx.restore();
      },
    });
  }

  public sample(
    label: string,
    value: number,
    size: number,
    transform = (value: number) => value.toString(),
    color: string = green()
  ): void {
    if (size <= 1) {
      throw new Error("Cannot sample 1 value!");
    }

    const cache = this.sampleCache.get(label);
    if (!cache) {
      this.sampleCache.set(label, {
        size: size,
        values: [value],
        lastSampleValue: 0,
      });
      return;
    }

    let values = [...cache.values, value];
    let lastSampleValue = cache.lastSampleValue;
    if (values.length === cache.size) {
      values = [];
      lastSampleValue = mean(cache.values);
    }

    this.print(label, transform(lastSampleValue), color);

    this.sampleCache.set(label, {
      size,
      values,
      lastSampleValue,
    });
  }

  public draw(): void {
    if (!DEBUG) {
      return;
    }

    for (const { fn } of this.queue) {
      this.ctx.save();
      this.ctx.font = this.style;
      fn();
      this.y += this.size;
      this.ctx.restore();
    }
    this.queue.clear();
    this.y = 0;
  }
}
