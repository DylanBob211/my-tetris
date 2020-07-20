import Game from './Game.js';

export default class GameManager{
  constructor(DOMNodeSelector) {
    this.games = new Set;
    this.selector = DOMNodeSelector;
  }

  generateGame() {
    const game = new Game({
      selector: this.selector
    })
    this.games.add(game);
    return game;
  }

  removeGame(game) {
    game.removeGame(this.selector);
    this.games.delete(game);
  }
}