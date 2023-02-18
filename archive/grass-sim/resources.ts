import { SpriteData } from "../../src/engine/sprites/sprites";
import { vec } from "../engine/vec";
import grassSection from "../../src/resources/grass_tile2.png";
import sheep from "../../src/resources/grass_tile4.png";
import sheep2 from "../../src/resources/grass_tile6.png";
import ground from "../../src/resources/grass_tile5.png";
import marquee from "../../src/resources/grass_tile3.png";

export const resources = new Map<string, SpriteData>([
  ["grass-section", { offset: vec(-16, -24), path: grassSection }],
  ["sheep", { offset: vec(-16, -18), path: sheep }],
  ["sheep-2", { offset: vec(-16, -18), path: sheep2 }],
  ["ground", { offset: vec(-16, -24), path: ground }],
  ["marquee", { offset: vec(-16, -24), path: marquee }],
]);
