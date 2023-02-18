import { Vec } from "../units/vec";

class Node {
  public g = 0;
  public h = 0;
  constructor(public pos: Vec, public parent: Node | null = null) {}

  public getCost(): number {
    return this.g + this.h;
  }

  public getAdjacentPos(): Vec[] {
    const p = this.pos;
    const adj = [p.add(-1, 0), p.add(1, 0), p.add(0, -1), p.add(0, 1)];
    return adj;
  }
}

export function createPathFinding(grid: boolean[][]) {
  return new PathFinder(grid);
}

export class PathFinder {
  private openList: Node[] = [];
  private closedList: Node[] = [];

  constructor(private grid: boolean[][]) {}

  private getTotalNodes(): number {
    if (this.grid[0] === undefined) {
      throw new Error("Path finding grid must be a square");
    }
    return this.grid.length * this.grid[0].length;
  }

  private normalisePath(end: Node): Vec[] {
    const path: Vec[] = [];
    let current: Node | null = end;
    while (current !== null) {
      path.push(current.pos.clone());
      current = current.parent;
    }
    return path.reverse();
  }

  private isInRange(pos: Vec): boolean {
    return this.grid[pos.x] && this.grid[pos.x][pos.y] !== undefined;
  }

  private isWalkable(pos: Vec): boolean {
    return this.grid[pos.x] && this.grid[pos.x][pos.y];
  }

  public pathTo(start: Vec, end: Vec): Vec[] {
    // create start and end node
    const startNode = new Node(start.clone(), null);
    const endNode = new Node(end.clone(), null);
    this.openList = [];
    this.closedList = [];

    this.openList.push(startNode);
    const maxIterations = this.getTotalNodes();
    let totalIterations = 0;
    while (this.openList.length) {
      totalIterations++;

      if (totalIterations > maxIterations) {
        break;
      }

      const sortedList = this.openList.sort(
        (a, b) => b.getCost() - a.getCost()
      );
      const currentNode = sortedList.pop()!;
      this.closedList.push(currentNode);

      if (currentNode.pos.equals(end.x, end.y)) {
        return this.normalisePath(currentNode);
      }

      const children: Node[] = [];
      for (const newPos of currentNode.getAdjacentPos()) {
        if (!this.isInRange(newPos)) {
          continue;
        }

        // TODO: walkable terrain
        if (!this.isWalkable(newPos)) {
          continue;
        }

        const childNode = new Node(newPos, currentNode);
        children.push(childNode);
      }

      for (const child of children) {
        if (this.closedList.includes(child)) {
          continue;
        }

        child.g = currentNode.g + 1;
        child.h =
          (child.pos.x - endNode.pos.x) ** 2 +
          (child.pos.y - endNode.pos.y) ** 2;

        let shouldContinue = false;
        this.openList.forEach((node) => {
          if (node.pos.equalsv(child.pos) && child.g > node.g) {
            shouldContinue = true;
          }
        });
        if (shouldContinue) {
          continue;
        }

        this.openList.push(child);
      }
    }

    console.warn(
      `Could not find path from ${start.toString()} -> ${end.toString()}`
    );
    return [];
  }
}
