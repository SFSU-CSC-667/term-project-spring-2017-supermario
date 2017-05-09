/* this part is refactored to socket-server
const socketIo = require('socket.io');
const eventHandler = require('./event-handler.js');

const GAMESERVER = 'game server';

const game = (app, server) => {
  const io = socketIo(server);

  app.set('io', io);

  io.on('connection', socket => {
      console.log('game client connected');

      socket.on('disconnect', data => {
          console.log('game client disconnected');
      });

      socket.on('chat message', function(msg) {
        socket.emit('chat message', msg);
      });

      socket.on(GAMESERVER, function(msg) {
        // next line is for testing use
        console.log('server received ', JSON.stringify(msg));
          socket.emit(GAMESERVER, 'server sent me: ' + JSON.stringify(eventHandler(msg).player));
          io.sockets.emit(GAMESERVER, 'server broadcast: ' + JSON.stringify(eventHandler(msg).group));
      });
  });
}

*/

function getData(word) {
  console.log(word)
  switch (word) {
    case 'cardImages':
      return db.cardImages;
      break;
    case 'cardId':
      return db.cardId;
      break;
    case 'myInfo':
      return 'get myInfo';
      break;
    case 'playersInfo':
      return 'get playersInfo';
      break;
    case 'playersState':
      return 'get playersState';
      break;
    case 'skip':
      return 'get skip';
      break;
    case 'ready':
      return 'get ready';
      break;
    case 'red':
      return 'get red';
      break;
    case 'uno':
      return 'get uno';
      break;
    case 'exit':
      return 'get exit';
      break;
    default:
      return 'no matched word';
  }
}

module.exports = { game };