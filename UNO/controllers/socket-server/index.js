const socketIo = require('socket.io');
const outPackage = require('../game');

const GAMESERVER = 'game server';

const socketServer = (app, server) => {
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
          socket.emit(GAMESERVER, outPackage(msg).player);
          io.sockets.emit(GAMESERVER, outPackage(msg).group);
      });
  });
}

module.exports = socketServer;