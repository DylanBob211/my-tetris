import { Matrix } from './Math.js';
import Events from './Events.js';

export default class Arena extends Matrix {
  constructor({ width, height, matrixScale = 1 }, game) {
    super(width, height, matrixScale);
    this.game = game;
    this.player = null;

    this.events = new Events();
  }

  setPlayer(player) {
    this.player = player;
  }

  drawBackground(context) {
    context.fillStyle = '#000';
    context.fillRect(0, 0, this.width, this.height);
  }

  drawArena(context) {
    this.matrix.forEach((row, y) => {
      row.forEach((square, x) => {
        if (square !== 0) {
          context.fillStyle = 'red';
          context.fillRect(x, y, 1, 1);
        }
      })
    })
  }

  clear() {
    this.matrix.forEach(row => row.fill(0));
    this.events.emit('matrix', this.matrix);
  }

  deleteCompletedRows() {
    let clearedRowCounter = 0;
    this.matrix.forEach((row, y) => {
      if (!row.includes(0)) {
        clearedRowCounter++;
        this.matrix.splice(y, 1);
        const newRow = new Array(this.width).fill(0);
        this.matrix.unshift(newRow);
      }
    })
    this.events.emit('matrix', this.matrix);
  }

  merge() {
    this.player.piece.matrix.forEach((row, y) => {
      row.forEach((square, x) => {
        if(square !== 0) {
          this.matrix[y + this.player.position.y][x + this.player.position.x] = square;
        }
      })
    })
    this.events.emit('matrix', this.matrix);
  }
  
}