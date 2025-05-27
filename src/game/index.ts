import Game from "../engine/Game";
const behaviors = import.meta.glob("./behaviors/*.ts", { eager: true });
import scene from "./scenes/default.json";
// import native from "../editor/callNative";

let game: Game;
if (!Game.instance) {
  game = new Game(960, 540, 64, 1);
  game.registerBehaviors(behaviors);
  game.loadScene(scene);
  game.start();
  // game.play();
} else {
  game = Game.instance;
}

// @ts-expect-error - window.game is a global variable
window.game = game;

// save the scene
// const serialized = game.serialize();
// native.saveFile(
//   "src/game/scenes/default.json",
//   JSON.stringify(serialized, null, 2)
// );

export default game;
