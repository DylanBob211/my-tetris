import Arena from './Arena.js';
import Player from './Player.js';

export default class Game {
  constructor({ selector, width = 240, height = 400, scale = 20 }) {
    this.width = width;
    this.height = height;
    this.contextScale = scale;
    
    this.canvas = null;
    this.context = null;

    this._createCanvas(selector);
  
    this.arena = new Arena({
      width,
      height,
      matrixScale: scale
    }, this);
    this.player = new Player(this);
    this.arena.setPlayer(this.player);

    this.loopID = null;
    this.lastTime = 0;
  }

  _createCanvas(selector) {
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('width', this.width);
    this.canvas.setAttribute('height', this.height);
    this.context = this.canvas.getContext('2d');
    this.context.scale(this.contextScale, this.contextScale);
    selector.appendChild(this.canvas);
  }

  removeGame(selector) {
    selector.removeChild(this.canvas);
  }

  collide() {
    const [matrix, offset] = [this.player.piece.matrix, this.player.position];
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < matrix[y].length; ++x) {
        if (
          matrix[y][x] !== 0 &&
          (this.arena.matrix[y + offset.y] &&
          this.arena.matrix[y + offset.y][x + offset.x]) !== 0
        ) {
          return true;
          }
      }
    }
    return false;
  }

  draw() {
    this.arena.drawBackground(this.context);
    this.arena.drawArena(this.context);
    this.player.drawPlayer(this.context);
  }

  gameLoop(time = 0) {
    const deltaTime = time - this.lastTime;
    this.lastTime = time;

    this.player.update(deltaTime);
    this.draw();
    this.loopID = requestAnimationFrame(timestamp => this.gameLoop(timestamp));
  }

  start() {
    this.gameLoop();
  }

  stop() {
    cancelAnimationFrame(this.loopID);
    this.loopID = null;
  }

  serialize() {
    return {
      arena: {
        matrix: this.arena.matrix
      },
      player: {
        position: this.player.position,
        piece: {
          matrix: this.player.piece.matrix
        },
      }
    }
  }

  unserialize(state) {
    const { arena, player } = state;
    this.arena.matrix = arena.matrix;
    this.player.position = player.position;
    this.player.piece.matrix = player.piece.matrix;
    this.draw();
  }
}