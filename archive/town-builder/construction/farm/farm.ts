import { Building, Producer } from "../building";
import { createStateMachine, State } from "../../../../src/engine/stateMachine";
import { ConstructionState } from "../state/construction-state";
import { Resource } from "../../economy/economy";
import { IdleState } from "../state/idle-state";
import { Vec, vec } from "../../../engine/vec";
import {
  DAY_DURATION,
  SPRITE_SCALE,
  SPRITE_SIZE,
} from "../../../../src/engine/settings";
import { ConstructionType } from "../construction";

// TODO (refactor): day_duration should live in the time manager so it can be dynamic
export const FARM_MIN_WORKERS = 2;
export const FARM_CONSTRUCTION_TIME = DAY_DURATION / 4;
export const FARM_PRODUCTION_INTERVAL = DAY_DURATION / 2;
export const FARM_PRODUCTION_PER_INTERVAL = 12;

export function createFarm(): Farm {
  const f = new Farm(
    Farm.getSprite(),
    Farm.getSpriteOffset(),
    ConstructionType.Farm,
    FARM_MIN_WORKERS
  );
  const sm = createStateMachine(
    new ConstructionState(f, FARM_CONSTRUCTION_TIME)
  );
  f.stateMachine = sm;
  return f;
}

export class Farm extends Building implements Producer {
  discriminator: "Producer" = "Producer";

  public static getSprite(): string {
    return "builder_2";
  }

  public static getSpriteOffset(): Vec {
    const unit = SPRITE_SIZE * SPRITE_SCALE;
    return vec(-(unit / 2), -(unit / 2));
  }

  public getResourceType(): Resource {
    return Resource.Food;
  }

  public produce(): number {
    return FARM_PRODUCTION_PER_INTERVAL;
  }

  public getProductionInterval(): number {
    return FARM_PRODUCTION_INTERVAL;
  }

  public getIdleState(): State {
    return new IdleState();
  }
}
