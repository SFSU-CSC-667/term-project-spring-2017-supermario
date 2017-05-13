const socketIo = require('socket.io');
const db = require('../../database/game');
const Users=require('../../models/users');
const Games=require('../../models/games');
const Players=require('../../models/players');
const socketServer=require('../socket-server');
const MaxPlayer = 4;

function lobby(msg) {

return new Promise( function(fulfill, reject){
			
		switch(msg.action){
			case "create_game":
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
						for (seatNum=2; seatNum <= MaxPlayer; seatNum++){
							Players.createEmptySeats(game.id, seatNum).catch( error => {
								console.log(error);
							});
						}
						console.log(player);
						Games.listJoinables().then( games=> {
							/*
							games.forEach( game => {
								Players.findByGameId(game.id).then( pls => {
									game.players=pls;
								});
							});	*/					
							var msg={games: games, action:"update_games"};
							fulfill({player:msg, group:msg});
						}).catch( error => {
							games={};
							var msg={games: games, action:"update_games"};
							reject({player:msg, group:msg});
						});
			
					}).catch(error => {
						console.log(error);
						reject(error);
					});
		
				}).catch( error => {
					console.log(error);
					reject(error);
				});
			
			}).catch( error => {
				console.log(error);
				reject(error);
			});
		break;
	case "join_game":
		Users.findByEmail(msg.email).then( user => {
			console.log("join_game");
			console.log(msg.game_id);
			console.log(user.id);
			Games.findById(msg.game_id).then( game => {
				console.log(game);
				var player = {
					game_id: game.id,
					user_id: user.id,
				};
				Players.addPlayer(player).then( pl => {
					console.log(pl);
					var toPlayer = {game_id: game.id, action: "enter_gameroom"};
					var toGroup = {game_id: game.id, user_nick_name: user.email, action: "update_one_player"};
					fulfill({player:toPlayer, group:toGroup});
				});
			});
		}).catch(error => {
			console.log(error);
			reject(error);
		});

		break;
	}
	});
}

module.exports = lobby;
