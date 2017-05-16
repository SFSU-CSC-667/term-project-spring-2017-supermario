const socketIo = require('socket.io');
const eventHandler = require('../game');

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

      socket.on('game', function(msg) {
        console.log('server received: ', msg)
        eventHandler(msg, function(toPlayer, toGroup) {
//          console.log('socket to player: ', toPlayer, ' to group: ', toGroup)
          socket.emit('game', toPlayer);
          io.emit('game', toGroup);
        })
      });
  });
}

module.exports = socketServer;