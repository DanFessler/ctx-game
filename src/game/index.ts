import Game from "../engine/Game";
import native from "../editor/callNative";
import GameObject from "../engine/GameObject";
import Camera from "../engine/behaviors/Camera";
import { Rectangle } from "../engine/behaviors/Rectangle";
import { Transform } from "../engine/behaviors/Transform";
import CameraControllerBehavior from "./behaviors/PlayerCamera";
import RedRectangleBehavior from "./behaviors/RedRectangle";
import TileMapBehavior from "./behaviors/TileMap";
import WorldGridBehavior from "./behaviors/WorldGrid";

const behaviors = import.meta.glob("./behaviors/*.ts", { eager: true });

const TileMap = new GameObject({
  name: "TileMap",
  behaviors: [new TileMapBehavior(), new WorldGridBehavior({ spacing: 1 })],
});

const RedRectangle = new GameObject({
  name: "RedRectangle",
  behaviors: [
    new Transform({
      position: { x: 0, y: 0 },
      scale: { x: 3, y: 3 },
      origin: { x: 1.5, y: 1.5 },
    }),
    new Rectangle({ color: "#ff0000" }),
    new RedRectangleBehavior(),
  ],
  children: [
    new GameObject({
      name: "Blue Rectangle",
      behaviors: [
        new Transform({
          position: { x: 0, y: 0 },
          scale: { x: 1, y: 1 },
          origin: { x: 0.5, y: 0.5 },
        }),
        new Rectangle({ color: "#0000ff" }),
      ],
    }),
  ],
});

const PlayerCamera = new GameObject({
  name: "PlayerCamera",
  behaviors: [new Camera(), new CameraControllerBehavior()],
});

let game: Game;
if (!Game.instance) {
  game = new Game(960, 540, 64, 1);
  game.registerBehaviors(behaviors);
  game.addGameObject(TileMap);
  game.addGameObject(RedRectangle);
  game.addGameObject(PlayerCamera);
  // game.addGameObject(TestObject);
  game.start();
  // game.play();
} else {
  game = Game.instance;
}

const serialized = game.serialize();
// console.log("SERIALIZED", JSON.stringify(serialized, null, 2));

native.saveFile(
  "src/game/scenes/default.json",
  JSON.stringify(serialized, null, 2)
);

export default game;
