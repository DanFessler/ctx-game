import Game from "../engine/Game";
import PlayerCamera from "../example/objects/PlayerCamera";
import RedRectangle from "../example/objects/RedRectangle";
import TileMap from "../example/objects/TileMap";

let game: Game;
if (!Game.instance) {
  game = new Game(960, 540, 64, 1);
  game.addGameObject(new TileMap());
  game.addGameObject(new RedRectangle());
  game.addGameObject(new PlayerCamera());
  game.start();
  game.play();
} else {
  game = Game.instance;
}

export default game;
