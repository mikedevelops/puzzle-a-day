export function createScene(name = "main"): Scene {
  return new Scene(name);
}

export class Scene {
  constructor(public name: string) {}
}
