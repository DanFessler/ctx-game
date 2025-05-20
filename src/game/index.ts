import Game from "../engine/Game";
import PlayerCamera from "./objects/PlayerCamera";
import RedRectangle from "./objects/RedRectangle";
import TileMap from "./objects/TileMap";
import native from "../editor/callNative";

let game: Game;
if (!Game.instance) {
  game = new Game(960, 540, 64, 1);
  game.addGameObject(new TileMap());
  game.addGameObject(new RedRectangle());
  game.addGameObject(new PlayerCamera());
  game.start();
  // game.play();
} else {
  game = Game.instance;
}

const serialized = game.serialize();
console.log("SERIALIZED", JSON.stringify(serialized, null, 2));
native.saveFile("test2.json", JSON.stringify(serialized, null, 2));

export default game;
