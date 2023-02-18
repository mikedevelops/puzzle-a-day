import { Building, Producer } from "../building";
import { createStateMachine, State } from "../../../../src/engine/stateMachine";
import { IdleState } from "../state/idle-state";
import { Resource } from "../../economy/economy";
import { vec } from "../../../engine/vec";
import { ConstructionState } from "../state/construction-state";
import {
  DAY_DURATION,
  SPRITE_SCALE,
  SPRITE_SIZE,
} from "../../../../src/engine/settings";
import { ConstructionType } from "../construction";

export const SAWMILL_MIN_WORKERS = 1;
export const SAWMILL_CONTRSUCTION_TIME = DAY_DURATION / 2;
export const SAWMILL_PRODUCTION_INTERVAL = DAY_DURATION / 2;
export const SAWMILL_PRODUCTION_OER_INTERVAL = 2;

export function createSawmill(): Sawmill {
  const s = new Sawmill(
    Sawmill.getSprite(),
    vec(
      -((SPRITE_SIZE * SPRITE_SCALE) / 4),
      -((SPRITE_SIZE * SPRITE_SCALE) / 2)
    ),
    ConstructionType.Sawmill,
    SAWMILL_MIN_WORKERS
  );
  const sm = createStateMachine(
    new ConstructionState(s, SAWMILL_CONTRSUCTION_TIME)
  );
  s.stateMachine = sm;
  return s;
}

export class Sawmill extends Building implements Producer {
  discriminator: "Producer" = "Producer";

  public static getSprite(): string {
    return "builder_1";
  }

  public getIdleState(): State {
    return new IdleState();
  }

  public getProductionInterval(): number {
    return SAWMILL_PRODUCTION_INTERVAL;
  }

  public getResourceType(): Resource {
    return Resource.Wood;
  }

  public produce(): number {
    return SAWMILL_PRODUCTION_INTERVAL;
  }
}
