class Client {
  constructor(connection, id) {
    this.connection = connection;
    this.session = null;
    this.id = id;
    this.state = null;
  }

  send(data) {
    const msg = JSON.stringify(data);
    this.connection.send(msg, (err) => {
      if (err) {
        console.error('Message Failed', msg, err);
      }
    });
  }

  broadcast(data) {
    if(!this.session) {
      throw new Error('cannot broadcast without session');
    }
    data.clientId = this.id;

    this.session.clients.forEach(client => {
      if (this === client) return;
      client.send(data);
    });
  }
}

module.exports = Client;