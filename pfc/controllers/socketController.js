import Game from '../scripts/game.js';

export default class SocketController {

  #io;
  #clients;
  #firstSocket;
  #secondSocket;
  #redirectPage = 'full-game.html';

  constructor(io) {
    this.#io = io;
    this.#clients = [];
    this.#firstSocket = null;
    this.#secondSocket = null;
  }

  registerSocket(socket) {
    console.log(`${socket.id} has connected`);

    if(!this.#firstSocket) {
      this.#firstSocket = socket;
      console.log('Waiting for a player...');
      socket.emit('message','Waiting for another player...');
      this.verifyConnexions();
    } else if(!this.#secondSocket) {
      this.#secondSocket = socket;
      console.log('Waiting for a player...');
      socket.emit('message','Waiting for another player...');
      this.verifyConnexions();
    } else {
      console.log('Unauthorized access : only 2 players can be connected');
      socket.emit('redirect', { page: this.#redirectPage });
    }
    if(this.#firstSocket && this.#secondSocket) {
      this.clearEventsForAll();

      console.log("We found a player : game can start !");
      new Game(this.#firstSocket, this.#secondSocket);
    }
    this.setupListeners(socket);
  }

  clearEventsForSingleSocket(index) {
    this.this.getSockets()[index].emit('clear');
  }

  clearEventsForAll() {
    this.getSockets().forEach(sock => sock.emit('clear'));
  }

  getSockets() {
    return [this.#firstSocket, this.#secondSocket];
  }


  setupListeners(socket) {
    socket.on('message', (text) => {
      io.emit('message', text);
    });
    socket.on( 'greatings' , user => this.greatings(socket, user.name) );
    socket.on( 'disconnect', () => this.leave(socket) );
  }

  greatings(socket, userName) {
    console.log(`greatings received from ${userName} (id : ${socket.id})`);
    this.#clients.set(socket.id, userName);
    socket.emit('welcome');
  }


  removeSocket(socket) {
    const index = this.#clients.indexOf(socket);
    this.#clients.splice(index, 1);
  }

  leave(socket) {
    console.log(`${socket.id} just disconnected.`);
    this.removeSocket(socket);
    const msg = '<small> Your opponent has disconnected. Waiting for a new one... </small>';

    if(socket.id === this.#firstSocket?.id) {
      this.#firstSocket = null;
      this.#secondSocket?.emit('message', msg);
    }
    if(socket.id === this.#secondSocket?.id) {
      this.#secondSocket = null;
      this.#firstSocket?.emit('message', msg);
    }
    socket.disconnect(true);
  }

  verifyConnexions() {
    console.log("Verifying players connexion");
    if(this.#firstSocket !== null && this.#secondSocket !== null) {
        Promise.resolve(() => console.log("Emitting to sockets"))
            .then(() => this.#secondSocket.emit('can_start'), () => console.log("Not sent to right"))
            .then(() =>this.#firstSocket.emit('can_start'), () => console.log("Not sent to left"))

        console.log("Connections established!");
    }
  }

}
