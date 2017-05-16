const socketIo = require('socket.io');
const eventHandler = require('../game');
const lobbyController = require('../lobby');
const LOBBYSERVER = 'lobby server';

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
      
	  socket.on(LOBBYSERVER, function(msg) {
        // next line is for testing use
        console.log('server received ', JSON.stringify(msg));
		  lobbyController(msg).then(ret => {	
			console.log(ret.group.games);
          	socket.emit(LOBBYSERVER, ret.player);
          	io.sockets.emit(LOBBYSERVER, ret.group);
		  }).catch( error => {
			console.log(error);
		  });
      });
  });
}

module.exports = socketServer;
