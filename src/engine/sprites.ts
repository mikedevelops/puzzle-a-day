import { Vec } from "./vec";
import { createCanvas, CTX } from "./canvas";
import { DEBUG_RESOURCES, SPRITE_SCALE } from "./settings";
import { Color } from "./color";

class Sprite {
  constructor(public key: string, public img: CTX, public offset: Vec) {}

  public getWidth(): number {
    return this.img.canvas.width * SPRITE_SCALE;
  }

  public getHeight(): number {
    return this.img.canvas.width * SPRITE_SCALE;
  }
}

export interface SpriteData {
  path: string;
  offset: Vec;
}

export function createSpriteManager(): SpriteManager {
  return new SpriteManager();
}

export class SpriteManager {
  private sprites: Map<string, Sprite> = new Map();

  constructor() {}

  public get(key: string): Sprite | null {
    if (!this.sprites.has(key)) {
      return null;
    }

    return this.sprites.get(key) as Sprite;
  }

  public async load(assets: Map<string, SpriteData>): Promise<void> {
    for (const [key, data] of assets.entries()) {
      const img = await this.loadAsset(key, data.path);
      this.sprites.set(
        key,
        new Sprite(key, img, data.offset.multiply(SPRITE_SCALE, SPRITE_SCALE))
      );
    }

    console.log("Loaded Sprites!", this.sprites);
  }

  private loadAsset(key: string, path: string): Promise<CTX> {
    const img = document.createElement("img");

    return new Promise((res, rej) => {
      img.onerror = rej;
      img.onload = () => {
        const sw = img.width * SPRITE_SCALE;
        const sh = img.height * SPRITE_SCALE;
        const cvs = createCanvas(sw, sh);
        cvs.ctx.drawImage(img, 0, 0, sw, sh);
        cvs.el.setAttribute("style", "border: 1px solid red");

        if (DEBUG_RESOURCES) {
          const dcvs = cvs.el.cloneNode() as HTMLCanvasElement;
          const dctx = dcvs.getContext("2d")!; // TODO: don't be lazy
          const data = cvs.ctx.getImageData(0, 0, cvs.el.width, cvs.el.height);
          const catalogue = document.getElementById("resource-catalogue")!; // TODO: don't be lazy
          catalogue.appendChild(dcvs);
          dctx.putImageData(data, 0, 0);
          dctx.fillStyle = Color.red().toString();
          dctx.fillText(key, 8, 16);
        }

        res(cvs.ctx);
      };
      img.src = path;
    });
  }
}
