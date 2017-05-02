const socketIo = require('socket.io');

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

      socket.on('game', function(msg) {
        socket.emit('game', 'Echo from game server:' + msg);
      });
  });
}

module.exports = { game };