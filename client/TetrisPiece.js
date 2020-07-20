import { T, J, S, Z, O, I, L } from './pieceMatrix.js';
export default class TetrisPiece {
  constructor() {
    this.matrix = null;
    this.color = null;
    this.getRandomPiece();
  }

  getPiece(type) {
    switch(type) { 
      case 'T' : return T;
      case 'J' : return J;
      case 'S' : return S;
      case 'Z' : return Z;
      case 'O' : return O;
      case 'I' : return I;
      case 'L' : return L;
    }
  }

  getRandomColor() {
    const colors = ['orange', 'yellow', 'green', 'blue', 'white']
    const randomColorIndex = () => Math.floor(Math.random() * colors.length)
    this.color = colors[randomColorIndex()]
  }

  getRandomPiece() {
    const types = ['T', 'J', 'S', 'Z', 'O', 'I', 'L'];
    const randomTypeIndex = () => Math.floor(Math.random() * types.length)
    this.matrix = this.getPiece(types[randomTypeIndex()])
    this.getRandomColor()
  }
  
  rotateMatrix() {
    for (let y = 0; y < this.matrix.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [this.matrix[x][y], this.matrix[y][x]]
          =
        [this.matrix[y][x], this.matrix[x][y]]
      }
    }
    this.matrix.reverse()
  }  
}