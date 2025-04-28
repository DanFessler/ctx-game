import GameObject from "../../engine/GameObject";
import Behavior from "../../engine/Behavior";
import Game from "../../engine/Game";
import tile from "../images/seashell.png";

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
  tileSize: number = 1;
  tileImage: HTMLImageElement;

  constructor() {
    super();
    this.tileImage = new Image();
    this.tileImage.src = tile;
  }

  draw() {
    const ctx = Game.instance?.ctx;
    if (!ctx) return;

    this.mapData.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile === 1) {
          ctx.drawImage(
            this.tileImage,
            x * this.tileSize,
            y * this.tileSize,
            this.tileSize,
            this.tileSize
          );
        }
      });
    });
  }
}

class TileMap extends GameObject {
  constructor() {
    super({
      behaviors: [new TileMapBehavior()],
    });
  }
}

export default TileMap;
