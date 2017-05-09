const socketIo = require('socket.io');
const db = require('../../database/game');
const Users=require('../../models/users')
const Games=require('../../models/games')
const Players=require('../../models/players')
const lobby = (app, server) => {
  const io = socketIo(server);
  app.set('io', io);

  io.on('connection', socket => {
      console.log('A client enters lobby');

      socket.on('disconnect', data => {
          console.log('A client left lobby');
      });

      socket.on('create_game', function(msg) {
			console.log(msg.email + ' created a new game');
			Users.findByEmail(msg.email).then( user => {
			console.log(user.id);
			Games.create(user.id).then( game => {
				console.log(game.id);
				console.log(user.id);
				var player = {
					game_id: game.id,
					user_id: user.id,
					seat_number: 1,
				};
				Players.create(player).then( player => {
					console.log(player);
					Games.listJoinables().then( games=> {
						var msg={games: games};
        				io.sockets.emit('update_games',msg);
					}).catch( error => {
					games={};
						var msg={games: games, error: error};
        				io.sockets.emit('update_games',msg);
					});
			
				}).catch(error => {
					console.log(error);
				});
			});
		
			}).catch( error => {
				console.log(error);
			});

      });

      socket.on('chat message', function(msg) {
		//socket.broadcast.emit('chat message', msg);
        io.sockets.emit('chat message', msg);
      });
      

  });
}

/* below line is commented for websocket conflict, comment out it if the conflict resolved.
	module.exports = { lobby };
*/