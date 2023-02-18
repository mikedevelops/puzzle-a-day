import { State, StateMachine } from "../../../../src/engine/stateMachine";

export interface HasDays {
  getDay(): number;
}

export type TimeState = State & HasDays;

function isTimeState(s: any): s is TimeState {
  return s["getDay"] && typeof s["getDay"] === "function";
}

export function createTimeMachine(initialState: TimeState): TimeMachine {
  return new TimeMachine(initialState);
}

export class TimeMachine extends StateMachine {
  public getDay(): number {
    const state = this.getState();
    if (!isTimeState(state)) {
      throw new Error("TimeMachine state does not implement TimeState!");
    }
    return state.getDay();
  }
}
