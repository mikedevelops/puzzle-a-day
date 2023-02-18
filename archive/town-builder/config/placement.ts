import { vec, Vec } from "../../engine/vec";
import { Grid } from "../../../src/engine/grid";
import { ConstructionType } from "../construction/construction";

interface BuildingPlacement {
  area: Vec[];
  outline: Vec[];
}

const PLACEMENT_RECTS: Map<ConstructionType, BuildingPlacement> = new Map([
  [
    ConstructionType.House,
    {
      area: [vec(0, 0), vec(-1, 0), vec(0, -1), vec(-1, -1)],
      outline: [vec(0, 0), vec(-2, 0), vec(-2, -2), vec(0, -2), vec(0, 0)],
    },
  ],
  [
    ConstructionType.Farm,
    {
      area: [
        vec(0, 0),
        vec(0, -1),
        vec(-1, 0),
        vec(-1, -1),
        vec(-2, 0),
        vec(-2, -1),
        vec(-2, -2),
        vec(-2, -3),
        vec(-3, 0),
        vec(-3, -1),
        vec(-3, -2),
        vec(-3, -3),
      ],
      outline: [
        vec(0, 0),
        vec(0, -2),
        vec(-2, -2),
        vec(-2, -4),
        vec(-4, -4),
        vec(-4, 0),
        vec(0, 0),
      ],
    },
  ],
  [
    ConstructionType.Sawmill,
    {
      area: [
        vec(0, 0),
        vec(-1, 0),
        vec(0, -1),
        vec(-1, -1),
        vec(-1, -2),
        vec(0, -2),
        vec(0, -3),
        vec(-1, -3),
      ],
      outline: [vec(0, 0), vec(0, -4), vec(-2, -4), vec(-2, 0), vec(0, 0)],
    },
  ],
  [
    ConstructionType.Warehouse,
    {
      area: [vec(0, 0), vec(0, -1), vec(-1, -1)],
      outline: [vec(0, 0)],
    },
  ],
  [
    ConstructionType.Path,
    {
      area: [vec()],
      outline: [vec()],
    },
  ],
]);

export function getOutlineIso(type: ConstructionType): Vec[] {
  if (!PLACEMENT_RECTS.has(type)) {
    throw new Error(`Cannot get placement rect for type ${type}`);
  }

  const outline = PLACEMENT_RECTS.get(type)!.outline;
  return outline.map((p) => Grid.cartToIso(p));
}

export function getArea(type: ConstructionType): Vec[] {
  if (!PLACEMENT_RECTS.has(type)) {
    throw new Error(`Cannot get placement rect for type ${type}`);
  }

  return PLACEMENT_RECTS.get(type)!.area;
}
