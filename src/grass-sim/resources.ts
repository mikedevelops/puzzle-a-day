import { SpriteData } from "../engine/sprites";
import { vec } from "../engine/vec";
import grassSection from "../resources/grass_tile2.png";
import sheep from "../resources/grass_tile4.png";
import ground from "../resources/grass_tile5.png";

export const resources = new Map<string, SpriteData>([
  ["grass-section", { offset: vec(-16, -24), path: grassSection }],
  ["sheep", { offset: vec(-16, -18), path: sheep }],
  ["ground", { offset: vec(-16, -24), path: ground }],
]);
