const WebSocketServer = require('ws').Server;
const Session = require('./Session');
const Client = require('./Client');

const server = new WebSocketServer({ port: 9000 });
const sessions = new Map;

function createId (len = 6, chars = 'abcdefghjkmnopqrstwxyz0123456789') {
  let id = '';
  while(len--) {
    id += chars[Math.random() * chars.length | 0]
  }
  return id;
}

function createSession(id = createId()) {
  if (sessions.has(id)) {
    throw new Error(`Session ${id} has already been created`);
  }
  const session = new Session(id);
  console.log(`creating session ${session.id}`);
  sessions.set(id, session);

  return session;
}

function createClient(connection, id = createId()) {
  return new Client(connection, id);
}

function getSession(id) {
  return  sessions.get(id);
}

function broadcastSession(session) {
  const clients = [...session.clients];
  clients.forEach(client => {
    client.send({
      type: 'session-broadcast',
      payload: {
        peers: {
          you: client.id,
          clients: clients.map(client => ({
            id: client.id,
            state: client.state
          })),
        }
      }
    })
  })
}

server.on('connection', connection => {
  console.log('connected');
  const client = createClient(connection);

  connection.on('message', msg => {
    const { type, payload } = JSON.parse(msg);
    if (type === 'create-session') {
      const session = createSession();
      session.join(client);

      client.state = payload.state
      sessions.set(session.id, session);
      client.send({
        type: 'session-created',
        payload: {
          id: session.id,
        }
      });
    } else if (type === 'join-session') {
      const session = getSession(payload.id) || createSession(payload.id);
      session.join(client);

      client.state = payload.state;
      console.log(client.state);
      broadcastSession(session);
      console.log(`client joining session ${session.id}`);
    } else if (type === 'state-update') {
      const [prop, value] = payload.state;
      client.state[payload.fragment][prop] = value;
      client.broadcast(JSON.parse(msg));
    }
  })

  connection.on('close', event => {
    console.log('closed', event);
    const session = client.session;
    if (session) {
      session.leave(client);
      broadcastSession(session);
      if (session.clients.size === 0) {
        sessions.delete(session.id);
      }
    }
  })
})