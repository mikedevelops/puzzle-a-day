import { createScene } from "./engine/scene";
import { vec, Vec } from "./engine/vec";
import {
  camera,
  collision,
  debug,
  input,
  renderer,
  sprites,
} from "./grass-sim/global";
import { SpriteData } from "./engine/sprites";
import { createLevel } from "./grass-sim/level";
import {
  DEBUG_SCENE,
  FPS,
  GRID_HEIGHT,
  GRID_UNIT,
  GRID_WIDTH,
  PAUSE,
} from "./engine/settings";
import { resources } from "./grass-sim/resources";
import { createLayer } from "./grass-sim/layer";
import { createGrass } from "./grass-sim/grass";
import { createCursor } from "./engine/cursor";
import { createSheep } from "./grass-sim/sheep";
import { randVec } from "./engine/maths";

const scene = createScene();
// TODO: why does a level need a width & height?
const level = createLevel(GRID_WIDTH, GRID_HEIGHT, GRID_UNIT);
const cursor = createCursor(vec());

camera.pos = level.getCenter().add(0, GRID_UNIT * 2);

function spawnSheep(): void {
  level.layers[0].add(
    createSheep(),
    randVec(vec(), vec(GRID_WIDTH - 1, GRID_HEIGHT - 1))
  );
}

// level.addLayer(createLayer(GRID_WIDTH - 2, GRID_HEIGHT - 2, vec(1, 1), 0));
level.addLayer(createLayer(GRID_WIDTH, GRID_HEIGHT, vec(), 0));
level.layers[0]?.fill(createGrass);

spawnSheep();
spawnSheep();
spawnSheep();
spawnSheep();
spawnSheep();
spawnSheep();
spawnSheep();

level.addCursor(cursor);

input.start();

let frame = 0;

function update(lastFrame: number) {
  const start = Date.now();
  const delta = start - lastFrame;
  const pointer = Vec.from(input.pointer);

  renderer.clear();

  if (DEBUG_SCENE) {
    debug.print("scene", scene.name);
    debug.print("frame", ++frame);
    debug.print("FPS", FPS);
    debug.print("delta", Math.round(1000 / delta));
    debug.print(
      "input",
      `${pointer.toString()} ${
        level.snapToGrid(pointer)?.local.toString() ?? "OOB"
      }`
    );
    debug.print("camera", camera.pos.toString());
  }

  level.update(delta);

  level.draw();
  level.debug();
  collision.debug();

  camera.present();
  camera.debug();

  const duration = Date.now() - start;
  const remainingDelta = 1000 / FPS - duration;

  debug.print(
    "frame duration",
    `${duration}ms (${remainingDelta.toFixed(2)}ms)`
  );

  debug.draw();

  if (!PAUSE) {
    // requestAnimationFrame(update.bind(null, start));
    setTimeout(update.bind(null, start), remainingDelta);
  }
}

sprites
  .load(new Map<string, SpriteData>(resources))
  .then(() => {
    update(Date.now() - 16);
  })
  .catch(console.log);
