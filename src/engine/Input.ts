export class Input {
  private static instance: Input | undefined;
  private keyStates: Map<string, boolean>;

  private constructor() {
    this.keyStates = new Map<string, boolean>();

    // Add event listeners when the singleton is created
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  public static getInstance(): Input {
    if (!Input.instance) {
      Input.instance = new Input();
    }
    return Input.instance;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    this.keyStates.set(event.key.toLowerCase(), true);
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.keyStates.set(event.key.toLowerCase(), false);
  }

  // Static methods for easy access
  public static isKeyPressed(key: string): boolean {
    return Input.getInstance().keyStates.get(key.toLowerCase()) || false;
  }

  public static isAnyKeyPressed(keys: string[]): boolean {
    return keys.some((key) => Input.isKeyPressed(key));
  }

  public static areAllKeysPressed(keys: string[]): boolean {
    return keys.every((key) => Input.isKeyPressed(key));
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

export default Input;
