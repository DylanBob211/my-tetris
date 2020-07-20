import { Vec } from './Math.js';
import Events from './Events.js';
import TetrisPiece from './TetrisPiece.js';

export default class Player {
  constructor(game) {
    this.position = new Vec(4, 0);
    this.piece = new TetrisPiece();
    this.game = game;
    this.arena = game.arena;

    this.events = new Events();
    this.dropCounter = 0;
    this.dropInterval = 1000;
  }

  drawPlayer(context) {
    this.piece.matrix.forEach((row, y) => {
      row.forEach((square, x) => {
        if (square !== 0) {
          context.fillStyle = this.piece.color;
          context.fillRect(x + this.position.x, y + this.position.y, 1, 1);
        }
      })
    })
  }

  reset() {
    this.position.y--;
    this.arena.merge();
    this.piece.getRandomPiece();
    this.position.y = 0;
    this.position.x = 
      (this.arena.matrix[0].length / 2 | 0) -
      (this.piece.matrix[0].length / 2 | 0);
    if (this.game.collide()) {
      this.game.arena.clear();
    }

    this.events.emit('position', this.position);
    this.events.emit('matrix', this.piece.matrix);
  }

  rotatePiece() {
    let offsetX = 1;
    this.piece.rotateMatrix();
    while (this.game.collide()) {
      this.position.x += offsetX;
      this.position.y--;
      offsetX = -(offsetX + (offsetX > 0 ? 1 : -1))
    }
    this.events.emit('matrix', this.piece.matrix);
  }

  moveOnXAxis(dir) {
    this.position.x += dir;
    if (this.game.collide()) {
      this.position.x -= dir;
      return;
    }
    this.events.emit('position', this.position);
  }

  dropDown() {
    this.position.y++;
    this.dropCounter = 0;
    if (this.game.collide()) {
      this.reset()
      this.arena.deleteCompletedRows();
    }
    this.events.emit('position', this.position);
  }

  update(deltaTime) {
    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.dropDown();
    }
  }
}