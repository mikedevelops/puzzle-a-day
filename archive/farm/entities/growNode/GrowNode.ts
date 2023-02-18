import { DisplayObject } from "../../../../src/engine/objects/displayObject";
import { Vec, vec } from "../../../engine/vec";
import { createStateMachine } from "../../../../src/engine/stateMachine";
import { createCollider } from "../../../../src/engine/collider";
import { Color } from "../../../../src/engine/color";
import { economy, time } from "../../global";
import { clamp, max } from "../../../../src/engine/maths";
import { WaitingToGrowState } from "./state/WaitingToGrowState";
import { GrowState } from "./state/GrowState";
import { IdleState } from "./state/IdleState";

let id = 0;

export enum GrowType {
  Corn = "CORN",
}

interface Lifecycle {
  sprite: string;
  harvest?: boolean;
  collider?: Vec[];
  value?: number;
}

export function createGrowConfig(
  type: GrowType,
  price: number,
  lifecycle: Map<number, Lifecycle>
): GrowConfig {
  return {
    type,
    lifecycle,
    price,
    cycleLength: max([...lifecycle.keys()]),
  };
}

export interface GrowConfig {
  type: GrowType;
  price: number;
  cycleLength: number; // TODO (refactor): this can be computed from the lifecycle
  lifecycle: Map<number, Lifecycle>;
}

export function createGrowNode(config: GrowConfig): GrowNode {
  const soil = new GrowNode(id++, vec(), config, vec());
  const sm = createStateMachine(new IdleState(soil));
  soil.stateMachine = sm;
  return soil;
}

export class GrowNode extends DisplayObject {
  private growth: number = 0;
  private stage: Lifecycle;
  private lastHarvestDay: number = 0;
  private harvested = false;

  constructor(id: number, pos: Vec, private config: GrowConfig, offset: Vec) {
    super(
      id,
      pos,
      "", // TODO (refactor): empty sprite because we'll set it from the config, this is weird (maybe?)
      offset
    );

    // TODO (refactor): urgh, maybe make growth config a class to hide validation logic
    const stage = this.config.lifecycle.get(0);
    if (stage) {
      this.stage = stage;
      this.sprite = stage.sprite;
      if (stage.collider) {
        this.addCollider(createCollider(stage.collider));
      }
    } else {
      throw new Error("No 0 stage defined for growth config!");
    }
  }

  public getType(): GrowType {
    return this.config.type;
  }

  public getCost(): number {
    return this.config.price;
  }

  public onPointerOver() {
    this.tint = Color.white();
  }

  public onPointerOut() {
    this.tint = Color.empty();
  }

  // public onPointerDown() {
  // TODO: these events should be handled or proxied to the active state
  // if (!this.stage.harvest) {
  //   return;
  // }
  //
  // if (this.stateMachine?.state instanceof GrowState) {
  //   this.harvest();
  // }
  // }

  public harvest(): void {
    economy.addCurrency(this.stage.value ?? 0);
    this.lastHarvestDay = Math.floor(time.getDay());
    this.harvested = true;
  }

  public reset(): void {
    this.growth = 0;
    this.harvested = false;
    const stage = this.config.lifecycle.get(this.growth);
    if (!stage) {
      // TODO (error): this really shouldn't ever happen :/
      return;
    }

    this.sprite = stage.sprite;
    if (stage.collider) {
      // TODO: don't create a new collider, cache them
      this.addCollider(createCollider(stage.collider));
    } else {
      this.removeCollider();
    }
  }

  public isHarvested(): boolean {
    return this.harvested;
  }

  public grow(day: number): void {
    // Skips growth for a day when harvested
    if (day < this.lastHarvestDay + 1) {
      return;
    }

    const nextStage = clamp(this.growth + 1, 0, this.config.cycleLength);

    if (nextStage === this.growth) {
      return;
    }

    const stage = this.config.lifecycle.get(nextStage);
    if (!stage) {
      return;
    }

    this.growth = nextStage;
    this.stage = stage;
    this.sprite = stage.sprite;
    if (stage.collider) {
      // TODO: this needs to be done ahead of time (once)
      this.addCollider(createCollider(stage.collider));
    }
  }

  public getName(): string {
    return "SOIL";
  }
}
