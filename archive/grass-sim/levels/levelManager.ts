import { Level } from "./level";

export function createLevelManager(): LevelManager {
  return new LevelManager();
}

class LevelManager {
  private level: Level | null = null;

  public load(level: Level): void {
    this.level = level;
  }

  public getActiveLevel(): Level {
    if (this.level === null) {
      throw new Error("No level loaded!");
    }

    return this.level;
  }
}
