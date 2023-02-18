export abstract class State {
  public abstract getName(): string;
  public abstract enter(): void;
  public abstract leave(): void;
  public abstract update(delta: number): State | null;

  public draw(): void {}
  public debug(): void {}
}

export function createStateMachine(start: State): StateMachine {
  return new StateMachine(start);
}

export class StateMachine {
  private activeStateHasEntered = false;

  constructor(public state: State | null = null) {}

  public update(delta: number): void {
    if (!this.activeStateHasEntered) {
      this.getState().enter();
      this.activeStateHasEntered = true;
    }

    const next = this.getState().update(delta);

    if (next === null) {
      return;
    }

    this.setState(next);
  }

  public draw(): void {
    this.getState().draw();
  }

  protected getState(): State {
    if (this.state === null) {
      throw new Error("StateManager has no state!");
    }

    return this.state;
  }

  public debug(): void {
    this.getState().debug();
  }

  public getActiveState(): State {
    return this.getState();
  }

  public setState(next: State): void {
    this.getState().leave();
    this.state = next;
    this.state.enter();
    this.activeStateHasEntered = true;
  }
}
