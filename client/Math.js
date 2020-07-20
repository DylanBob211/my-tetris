export class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class Matrix {
  constructor(w, h, scale) {
    this.width = w / scale;
    this.height = h / scale;
    this.matrix = this.generateMatrix();
    
  }

  generateMatrix() {
    const matrix = [];
    for (let i = 0; i < this.height; ++i) {
      const row = new Array(this.width).fill(0);
      matrix.push(row);
    }
    return [...matrix];
  }

  getMatrix() {
    return this.matrix;
  }
}