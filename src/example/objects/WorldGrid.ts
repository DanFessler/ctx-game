// import Camera from "../../engine/behaviors/Camera";
import GameObject from "../../engine/GameObject";
import Behavior from "../../engine/Behavior";

class WorldGridBehavior extends Behavior {
  draw() {
    // draw gridlines
    this.ctx!.strokeStyle = "black";
    const spacing = 10;
    for (let x = 0; x < 100; x += 10) {
      this.ctx!.beginPath();
      this.ctx!.moveTo(x * spacing, 0);
      this.ctx!.lineTo(x * spacing, 100 * spacing);
      this.ctx!.stroke();
    }
    for (let y = 0; y < 100; y += 10) {
      this.ctx!.beginPath();
      this.ctx!.moveTo(0, y * spacing);
      this.ctx!.lineTo(100 * spacing, y * spacing);
      this.ctx!.stroke();
    }
  }
}

class WorldGrid extends GameObject {
  constructor() {
    super({
      behaviors: [new WorldGridBehavior()],
    });
  }
}

export default WorldGrid;
