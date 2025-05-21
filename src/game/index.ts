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
console.log("BEHAVIORS", behaviors);

// const TileMap = new GameObject({
//   name: "TileMap",
//   behaviors: [new TileMapBehavior(), new WorldGridBehavior({ spacing: 1 })],
// });

// const RedRectangle = new GameObject({
//   name: "RedRectangle",
//   behaviors: [
//     new Transform(0, 0, 3, 3, 1.5, 1.5),
//     new Rectangle("#ff0000"),
//     new RedRectangleBehavior(),
//   ],
//   children: [
//     new GameObject({
//       name: "Blue Rectangle",
//       behaviors: [
//         new Transform(0, 0, 1, 1, 0.5, 0.5),
//         new Rectangle("#0000ff"),
//       ],
//     }),
//   ],
// });

// const PlayerCamera = new GameObject({
//   name: "PlayerCamera",
//   behaviors: [new Camera(), new CameraControllerBehavior()],
// });

const TestObject = new GameObject({
  name: "TestObject",
  behaviors: [new Camera(), new WorldGridBehavior({ spacing: 2 })],
});

let game: Game;
if (!Game.instance) {
  game = new Game(960, 540, 64, 1);
  // game.registerBehaviors(behaviors);
  // game.addGameObject(TileMap);
  // game.addGameObject(RedRectangle);
  // game.addGameObject(PlayerCamera);
  game.addGameObject(TestObject);
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
