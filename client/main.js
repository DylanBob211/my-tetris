import GameManager from './GameManager.js'
import ConnectionManager from './ConnectionManager.js';
import KeyboardControls from './KeyboardControls.js';

const gameManager = new GameManager(document.body);
const localPlayer = gameManager.generateGame();
localPlayer.canvas.classList.add('local');
new KeyboardControls(localPlayer).init();
localPlayer.start();

const connectionManager = new ConnectionManager(gameManager);
connectionManager.connect('ws://localhost:9000')