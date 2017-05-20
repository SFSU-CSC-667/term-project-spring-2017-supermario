const socketIo = require('socket.io');
const eventHandler = require('../game');
const lobbyController = require('../lobby');
const mockGameController = require('../mock-game');
const mockGAMESERVER = 'mock game server';

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
console.log('server received ', JSON.stringify(msg))
        eventHandler(msg, function(toPlayer, toGroup) {
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
	  socket.on(mockGAMESERVER, function(msg) {
        // next line is for testing use
        console.log('server received ', JSON.stringify(msg));
		  mockGameController(msg).then(ret => {	
          	socket.emit(mockGAMESERVER, ret.player);
          	io.sockets.emit(mockGAMESERVER, ret.group);
		  }).catch( error => {
			console.log(error);
		  });
      });
  });
}

module.exports = socketServer;
