import { createScene } from "../../src/engine/scene";
import { startRuntime } from "../../src/engine/runtime";
import { vec } from "../engine/vec";
import { economy, time } from "./global";
import { createCornNode } from "./entities/corn/Corn";
import { GrowType } from "./entities/growNode/GrowNode";

economy.addInventory(GrowType.Corn, 2);

const scene = createScene("main", 4, 4);

scene.addGameObject(time, vec());
scene.fill(createCornNode.bind(null));

startRuntime(
  scene,
  (delta) => {
    economy.debug();
  },
  () => {
    economy.draw();
  }
);
