import Game from "./Game";
import Vector2 from "./Vector2";

export class Input {
  private static instance: Input | undefined;
  private keyStates: Map<string, boolean>;
  private mouseStates: Map<number, boolean>;
  private canvas: HTMLCanvasElement | null = null;
  public mousePosition: Vector2;

  private constructor(canvas: HTMLCanvasElement) {
    this.keyStates = new Map<string, boolean>();
    this.mouseStates = new Map<number, boolean>();
    this.mousePosition = new Vector2(0, 0);

    // Add event listeners when the singleton is created
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));

    // mouse events
    canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    window.addEventListener("mouseup", this.handleMouseUp.bind(this));
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
  }

  public registerCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  public static getInstance(
    canvas: HTMLCanvasElement | Window = window
  ): Input {
    if (!Input.instance) {
      Input.instance = new Input(canvas as HTMLCanvasElement);
    }
    return Input.instance;
  }

  private handleMouseDown(event: MouseEvent): void {
    this.mouseStates.set(event.button, true);
  }

  private handleMouseUp(event: MouseEvent): void {
    this.mouseStates.set(event.button, false);
  }

  private handleMouseMove(event: MouseEvent): void {
    this.mousePosition = new Vector2(event.clientX, event.clientY);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    this.keyStates.set(event.key.toLowerCase(), true);
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.keyStates.set(event.key.toLowerCase(), false);
  }

  // Static methods for easy access
  public static isKeyPressed(key: string): boolean {
    // NOTE: not exactly sure the consequences of not supplying the canvas here
    return Input.getInstance().keyStates.get(key.toLowerCase()) || false;
  }

  public static isAnyKeyPressed(keys: string[]): boolean {
    return keys.some((key) => Input.isKeyPressed(key));
  }

  public static areAllKeysPressed(keys: string[]): boolean {
    return keys.every((key) => Input.isKeyPressed(key));
  }

  public static isMouseDown(button: number): boolean {
    return Input.getInstance().mouseStates.get(button) || false;
  }

  public static getMousePosition(): Vector2 {
    const input = Input.getInstance();
    const rect = input.canvas!.getBoundingClientRect();
    const relPos = new Vector2(
      input.mousePosition.x - rect.left,
      input.mousePosition.y - rect.top
    );
    return relPos.divide(Game.instance!.PPU); // returns in scaled canvas units, not pixels
  }

  // Cleanup method to remove event listeners if needed
  public static cleanup(): void {
    if (Input.instance) {
      window.removeEventListener("keydown", Input.instance.handleKeyDown);
      window.removeEventListener("keyup", Input.instance.handleKeyUp);
      Input.instance.keyStates.clear();
      Input.instance = undefined;
    }
  }
}

Input.getInstance();

export default Input;
