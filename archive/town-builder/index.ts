import { createScene } from "../../src/engine/scene";
import { startRuntime } from "../../src/engine/runtime";
import { vec } from "../engine/vec";
import { construction, economy, paths, population, time } from "./global";
import { camera, sprites } from "../../src/engine/global";
import { Resource } from "./economy/economy";
import * as sheet from "../../src/resources/town-builder/basic.png";
import { createCursor } from "./cursor/cursor";

const scene = createScene("main", 24, 24);
const cursor = createCursor();

scene.addGameObject(cursor);
scene.addGameObject(time);
// scene.addGameObject(paths); // not sure what this is doing yet...
scene.addGameObject(population);
scene.addGameObject(construction);

camera.snapTo(vec(0, -140));

// population.addPopulation(400);
economy.addResource(Resource.Food, 50000);
economy.addResource(Resource.Gold, 2000);

startRuntime(
  scene,
  async () => {
    await sprites.loadSheet("builder", sheet);
    construction.start();
    population.start();
    paths.start();
    cursor.start();
  },
  (delta) => {
    economy.debug();
  },
  () => {
    economy.draw();
  }
);
