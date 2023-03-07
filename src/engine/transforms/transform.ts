export abstract class Transform<T> {
  private active = false;

  public start(): void {
    this.active = true;
  }
}
