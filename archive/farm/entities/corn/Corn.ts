import {
  createGrowConfig,
  createGrowNode,
  GrowNode,
  GrowType,
} from "../growNode/GrowNode";
import { vec } from "../../../engine/vec";

const config = createGrowConfig(
  GrowType.Corn,
  2.5,
  new Map([
    [
      0,
      {
        sprite: "farm_96",
        collider: [
          vec(0, -24),
          vec(46, 0),
          vec(0, 24),
          vec(-46, 0),
          vec(0, -24),
        ],
      },
    ],
    [1, { sprite: "farm_192" }],
    [2, { sprite: "farm_288" }],
    [
      3,
      {
        sprite: "farm_384",
        harvest: true,
        value: 5,
        collider: [
          vec(0, -40),
          vec(38, -20),
          vec(38, 6),
          vec(0, 24),
          vec(-38, 6),
          vec(-38, -20),
          vec(0, -40),
        ],
      },
    ],
  ])
);

export function createCornNode(): GrowNode {
  return createGrowNode(config);
}
