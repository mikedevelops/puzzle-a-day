import { Scene } from "./scene";

export function createSceneManager(): SceneManger {
  return new SceneManger();
}

class SceneManger {
  private scenes: Scene[] = [];
  private activeScene: Scene | null = null;

  public start(): Scene {
    if (!this.scenes.length) {
      throw new Error("no scenes available");
    }
    this.activeScene = this.scenes[0];

    return this.activeScene;
  }

  public getActiveScene(): Scene {
    if (this.activeScene === null) {
      throw new Error("no active scene");
    }
    return this.activeScene;
  }

  public addScene(scene: Scene): void {
    if (this.scenes.indexOf(scene) !== -1) {
      return;
    }

    this.scenes.push(scene);
  }
}
