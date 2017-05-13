const socketIo = require('socket.io');
const db = require('../../database/game');
const Users=require('../../models/users');
const Games=require('../../models/games');
const Players=require('../../models/players');
const socketServer=require('../socket-server');


function lobby(msg) {

//		if(msg.action==="create_game") {

return new Promise( function(fulfill, reject){
			
			console.log(msg);
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
//	}

//	return {player:msg, group:msg};
	});
}

module.exports = lobby;
