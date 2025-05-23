export class Vector2 {
  constructor(public x: number = 0, public y: number = 0) {}

  static fromObject(obj: { x: number; y: number }): Vector2 {
    return new Vector2(obj.x, obj.y);
  }

  // Basic vector operations
  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  multiplyVec2(other: Vector2): Vector2 {
    return new Vector2(this.x * other.x, this.y * other.y);
  }

  divide(scalar: number): Vector2 {
    if (scalar === 0) throw new Error("Division by zero");
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  rotate(angle: number): Vector2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  // Vector properties
  get magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  get normalized(): Vector2 {
    const mag = this.magnitude;
    if (mag === 0) return new Vector2();
    return this.divide(mag);
  }

  // Utility methods
  dot(other: Vector2): number {
    return this.x * other.x + this.y * other.y;
  }

  distanceTo(other: Vector2): number {
    return this.subtract(other).magnitude;
  }

  equals(other: Vector2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  toString(): string {
    return `Vector2(${this.x}, ${this.y})`;
  }

  // Static utility methods
  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  static one(): Vector2 {
    return new Vector2(1, 1);
  }

  static up(): Vector2 {
    return new Vector2(0, 1);
  }

  static down(): Vector2 {
    return new Vector2(0, -1);
  }

  static left(): Vector2 {
    return new Vector2(-1, 0);
  }

  static right(): Vector2 {
    return new Vector2(1, 0);
  }
}

export default Vector2;
