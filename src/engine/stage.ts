import { Grid } from "./grid";

export function createStage(grid: Grid): Stage {
  return new Stage(grid);
}

class Stage {
  public grid: Grid;

  constructor(grid: Grid) {
    this.grid = grid;
  }
}
