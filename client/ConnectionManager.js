export default class ConnectionManager {
  constructor(gameManager) {
    this.connection = null;
    this.gameManager = gameManager;
    this.localGame = [...gameManager.games][0];
    this.players = new Map;
  }

  connect() {
    this.connection = new WebSocket('ws://localhost:9000');
    this.connection.addEventListener('open', () => {
      console.log('connection established');
      this.initSession();
      this.watchEvents();
    })

    this.connection.addEventListener('message', event => {
      this.receive(event.data);
    })
  }

  initSession() {
    const sessionId = window.location.hash.split('#')[1];
    const state = this.localGame.serialize();
    if (sessionId) {
      this.send({
        type: 'join-session',
        payload: {
          id: sessionId,
          state, 
        },
      })
    } else {
      this.send({
        type: 'create-session',
        payload: {
          state,
        }
      });
    }
  }

  watchEvents() {
    ['position', 'matrix'].forEach(event => {
      this.localGame.player.events.listen(event, value => {
        this.send({
          type: 'state-update',
          payload: {
            fragment: 'player',
            state: [event, value],
          }
        })
      })
    });
    ['matrix'].forEach(event => {
      this.localGame.arena.events.listen(event, value => {
        this.send({
          type: 'state-update',
          payload: {
            fragment: 'arena',
            state: [event, value],
          }
        })
      })
    });
  }
  
  send(data) {
    const msg = JSON.stringify(data);
    this.connection.send(msg);
  }

  receive(msg) {
    const data = JSON.parse(msg);
    if (data.type === 'session-created') {
      window.location.hash = data.payload.id;
    } else if (data.type === 'session-broadcast') {
      console.log(data.payload)
      const { peers } = data.payload;
      this.updateManager(peers);
    } else if (data.type === 'state-update') {
      this.updatePlayer(data.clientId, data.payload)
    }
  }

  updatePlayer(id, { fragment, state }) {
    const [prop, value] = state;
    if (!this.players.has(id)) {
      console.error('client does not exist', id);
      return;
    }
    const tetris = this.players.get(id);
    tetris[fragment][prop] = value;
    if (fragment === 'player' && prop === 'matrix') {
      tetris[fragment]['piece'][prop] = value;
    }
    tetris.draw();
  }

  updateManager(peers) {
    const me = peers.you;
    const otherClients = peers.clients.filter(clients => clients.id !== me);
    otherClients.forEach(({ id, state }) => {
      if (!this.players.has(id)) {
        const newGame = this.gameManager.generateGame();
        newGame.unserialize(state);
        this.players.set(id, newGame);
      }
      
    });
    const IDs = otherClients.map(client => client.id);
    [...this.players.entries()].forEach(([id, game]) => {
      if (!IDs.includes(id)) {
        this.gameManager.removeGame(game);
        this.players.delete(id);
      }
    })
  }
}