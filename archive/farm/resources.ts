import { SpriteData } from "../../src/engine/sprites/sprites";
import { vec } from "../engine/vec";
import soil from "../../src/resources/grass_tile5.png";

export const resources = new Map<string, SpriteData>([
  ["soil", { offset: vec(-16, -24), path: soil }],
]);
