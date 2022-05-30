export interface State {
  name: string;
  enter(): void;
  leave(): void;
  update(delta: number): State | null;
}

export function createStateMachine(start: State): StateMachine {
  return new StateMachine(start);
}

export class StateMachine {
  constructor(public state: State) {}

  public update(delta: number): void {
    const next = this.state.update(delta);

    if (next === null) {
      return;
    }

    this.setState(next);
  }

  public getActiveState(): string {
    return this.state.name;
  }

  public setState(next: State): void {
    this.state.leave();
    this.state = next;
    this.state.enter();
  }
}
