const socketIo = require('socket.io');
const outPackage = require('../game');
const lobbyController = require('../lobby');
const mockGameController = require('../mock-game');
const GAMESERVER = 'game server';
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

      socket.on(GAMESERVER, function(msg) {
        // next line is for testing use
        console.log('server received ', JSON.stringify(msg));
          socket.emit(GAMESERVER, outPackage(msg).player);
          io.sockets.emit(GAMESERVER, outPackage(msg).group);
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
			console.log(ret.group.games);
          	socket.emit(mockGAMESERVER, ret.player);
          	io.sockets.emit(mockGAMESERVER, ret.group);
		  }).catch( error => {
			console.log(error);
		  });
      });
  });
}

module.exports = socketServer;
