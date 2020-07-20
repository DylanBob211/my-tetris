export default class KeyboardControls {
  constructor(game) {
    this.game = game;
    this.player = game.player;
  }

  _callback(event) {
    switch(event.keyCode) {
      case 37: this.player.moveOnXAxis(-1);
      break;
      case 38: this.player.rotatePiece();
      break;
      case 39: this.player.moveOnXAxis(1);
      break;
      case 40: this.player.dropDown();
      break;
      case 27: this.game.stop()
      break;
      case 13: this.game.start();
      break;
    }
  }

  init() {
    document.addEventListener('keydown', event => this._callback(event));
  }

  cleanup() {
    document.removeEventListener('keydown', this._callback);
  }
}