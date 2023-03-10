import { vec, Vec } from "../units/vec";
import { Canvas, createCanvas, CTX } from "../canvas";
import { DEBUG_RESOURCES, SPRITE_SCALE, SPRITE_SIZE } from "../settings";
import { Color } from "../color";
import { rect, Rect } from "../units/rect";

class Sprite {
  constructor(public key: string, public img: CTX, public offset: Vec) {}

  public getWidth(): number {
    return this.img.canvas.width;
  }

  public getHeight(): number {
    return this.img.canvas.height;
  }
}

export interface SpriteData {
  path: string;
  offset: Vec;
}

interface SpriteFrame {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SheetData {
  [index: string]: {
    frames: SpriteFrame[];
  };
}

export function createSpriteManager(): SpriteManager {
  return new SpriteManager();
}

let spriteId = 0;

export class SpriteManager {
  private sprites: Map<string, Sprite> = new Map();

  constructor() {}

  public get(key: string): Sprite | null {
    if (!this.sprites.has(key)) {
      return null;
    }

    return this.sprites.get(key) as Sprite;
  }

  public async loadSheet(
    prefix: string,
    sheetPath: string,
    sheetData: SheetData
  ): Promise<void> {
    await this.sliceSheet(prefix, sheetPath, sheetData);
    console.log("sheet loaded", this.sprites);
  }

  private applyScale(frame: SpriteFrame): SpriteFrame {
    return {
      x: frame.x * SPRITE_SCALE,
      y: frame.y * SPRITE_SCALE,
      w: frame.w * SPRITE_SCALE,
      h: frame.h * SPRITE_SCALE,
    };
  }

  private async sliceSheet(
    prefix: string,
    sheetPath: string,
    sheetData: SheetData
  ): Promise<void> {
    const sheet = await this.loadAsset("sheet", sheetPath);

    for (const key in sheetData) {
      const sprite = sheetData[key];
      for (let i = 0; i < sprite.frames.length; i++) {
        const frame = this.applyScale(sprite.frames[i]);
        this.sliceSprite(
          sheet,
          rect(frame.x, frame.y, frame.w, frame.h),
          key,
          i
        );
      }
    }

    // const unit = SPRITE_SIZE * SPRITE_SCALE;
    // // TODO: this is all hardcoded, use sprite meta, eventually, also this isn't engine code...
    // this.sliceSprite(sheet, rect(0, 0, unit * 2.5, unit * 2), prefix);
    // this.sliceSprite(sheet, rect(0, unit * 2, unit * 2, unit * 2), prefix);
    // this.sliceSprite(sheet, rect(0, unit * 4, unit * 2.5, unit * 2), prefix);
    // this.sliceSprite(sheet, rect(0, unit * 6, unit * 2, unit * 2), prefix);
    // this.sliceSprite(sheet, rect(0, unit * 8, unit * 2, unit * 2), prefix);
    // this.sliceSprite(sheet, rect(0, unit * 10, unit * 2.5, unit * 2), prefix);
    // this.sliceSprite(sheet, rect(0, unit * 12, unit * 2.5, unit * 2), prefix);
    // this.sliceSprite(sheet, rect(0, unit * 14, unit * 3, unit * 2), prefix);
    // this.sliceSprite(
    //   sheet,
    //   rect(unit * 3, unit * 1.5, unit * 6.5, unit * 3.5),
    //   prefix
    // );
    // this.sliceSprite(sheet, rect(unit, 0, unit * 1.5, unit), prefix);
    // this.sliceSprite(sheet, rect(unit * 3, 0, unit * 1.5, unit), prefix);
    // this.sliceSprite(sheet, rect(unit * 5, 0, unit * 2, unit), prefix);
    // this.sliceSprite(
    //   sheet,
    //   rect(unit * 7, unit / 2, unit / 2, unit / 2),
    //   prefix
    // );
  }

  private sliceSprite(
    sheet: CanvasRenderingContext2D,
    rect: Rect,
    prefix: string,
    suffix = spriteId++
  ) {
    const name = `${prefix}_${suffix}`;
    const w = rect.width;
    const h = rect.height;
    const cvs = createCanvas(w, h, { willReadFrequently: true });
    const data = sheet.getImageData(rect.pos.x, rect.pos.y, w, h);
    cvs.ctx.putImageData(data, 0, 0);

    if (DEBUG_RESOURCES) {
      this.debugSprite(name, cvs);
    }

    this.sprites.set(name, new Sprite(name, cvs.ctx, vec()));
  }

  private debugSprite(name: string, cvs: Canvas): void {
    const dcvs = cvs.el.cloneNode() as HTMLCanvasElement;
    const dctx = dcvs.getContext("2d")!; // TODO: (types) don't be lazy
    const data = cvs.ctx.getImageData(0, 0, cvs.el.width, cvs.el.height);
    const catalogue = document.getElementById("resource-catalogue")!; // TODO: (types) don't be lazy
    catalogue.appendChild(dcvs);
    dctx.putImageData(data, 0, 0);
    dctx.fillStyle = Color.red().toString();
    dctx.strokeStyle = Color.red().toString();
    dctx.fillText(name, 8, 16);
    dctx.strokeRect(0, 0, cvs.el.width, cvs.el.height);
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
          // const dcvs = cvs.el.cloneNode() as HTMLCanvasElement;
          // const dctx = dcvs.getContext("2d")!; // todo: (types) don't be lazy
          // const data = cvs.ctx.getImageData(0, 0, cvs.el.width, cvs.el.height);
          // const catalogue = document.getElementById("resource-catalogue")!; // todo: (types) don't be lazy
          // catalogue.appendChild(dcvs);
          // dctx.putImageData(data, 0, 0);
          // dctx.fillStyle = Color.red().toString();
          // dctx.fillText(key, 8, 16);
        }

        res(cvs.ctx);
      };
      img.src = path;
    });
  }
}
