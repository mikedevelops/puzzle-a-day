import { Building } from "../building";
import { createStateMachine, State } from "../../../../src/engine/stateMachine";
import { ConstructionState } from "../state/construction-state";
import { HouseIdleState } from "./house-idle-state";
import { Vec, vec } from "../../../engine/vec";
import {
  DAY_DURATION,
  SPRITE_SCALE,
  SPRITE_SIZE,
} from "../../../../src/engine/settings";
import { Construction, ConstructionType } from "../construction";

export const HOUSE_MIN_WORKERS = 4;
export const HOUSE_POP_INCREASE = 4;
export const HOUSE_CONSTRUCTION_TIME = DAY_DURATION / 8;

export function createHouse(blueprint: boolean, pos = vec()): House {
  const h = new House(
    blueprint,
    ConstructionType.House,
    pos,
    House.getSprite(),
    House.getSpriteOffset()
  );
  // const sm = createStateMachine(
  //   new ConstructionState(h, HOUSE_CONSTRUCTION_TIME)
  // );
  // h.stateMachine = sm;
  return h;
}

export class House extends Construction {
  public static getSprite(): string {
    return "builder_0";
  }

  public static getSpriteOffset(): Vec {
    const unit = SPRITE_SIZE * SPRITE_SCALE;
    return vec(
      -((SPRITE_SIZE * SPRITE_SCALE) / 4),
      -((SPRITE_SIZE * SPRITE_SCALE) / 2)
    );
  }

  public getIdleState(): State {
    return new HouseIdleState();
  }

  public getName(): string {
    return "house";
  }
}
