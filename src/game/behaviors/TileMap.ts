import Behavior from "../../engine/Behavior";
import Game from "../../engine/Game";
import tile from "../images/seashell.png";
import { inspect } from "../../engine/serializable";

class TileMapBehavior extends Behavior {
  mapData: number[][] = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  @inspect({ type: "number" })
  tileSize: number = 1;

  start() {
    this.tileImage = new Image();
    this.tileImage.src = tile;
    this.buffer = document.createElement("canvas");
    this.buffer.width =
      this.tileSize * this.mapData[0].length * Game.instance!.PPU;
    this.buffer.height =
      this.tileSize * this.mapData.length * Game.instance!.PPU;
    this.bufferCtx = this.buffer.getContext("2d")!;
    this.bufferCtx.imageSmoothingEnabled = false;
  }

  draw(ctx: CanvasRenderingContext2D, renderPass?: string) {
    if (renderPass !== "editor") return;

    this.bufferCtx.clearRect(0, 0, this.buffer.width, this.buffer.height);
    // this.bufferCtx.drawImage(this.tileImage, 0, 0);
    for (let y = 0; y < this.mapData.length; y++) {
      for (let x = 0; x < this.mapData[y].length; x++) {
        if (this.mapData[y][x] === 1) {
          this.bufferCtx.drawImage(
            this.tileImage,
            x * this.tileSize * Game.instance!.PPU,
            y * this.tileSize * Game.instance!.PPU,
            this.tileSize * Game.instance!.PPU,
            this.tileSize * Game.instance!.PPU
          );
        }
      }
    }
    ctx.drawImage(
      this.buffer,
      0,
      0,
      this.buffer.width / Game.instance!.PPU,
      this.buffer.height / Game.instance!.PPU
    );
  }
}

export default TileMapBehavior;
