import http from 'http';
import { Server as ServerIO } from 'socket.io';
import RequestController from './controllers/requestController.js';
import SocketController from './controllers/socketController.js';


const server = http.createServer(
  (request, response) => new RequestController(request, response).handleRequest()
);

const io = new ServerIO(server);
const ioController = new SocketController(io);

io.on('connection', socket => ioController.registerSocket(socket));


server.listen(8080);
