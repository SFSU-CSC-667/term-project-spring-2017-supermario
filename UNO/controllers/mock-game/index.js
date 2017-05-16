const socketIo = require('socket.io');
const db = require('../../database/game');
const Users=require('../../models/users');
const Games=require('../../models/games');
const Players=require('../../models/players');
const Messages=require('../../models/messages');
const socketServer=require('../socket-server');
const MaxPlayer = 4;

function mockGame(msg) {

return new Promise( function(fulfill, reject){
			
		switch(msg.action){
			case "draw":
				var hands=[
					{id:1,
					 image_url: "r1.png",
					},
					{id:2,
					 image_url: "r1.png",
					},
					{id:3,
					 image_url: "r2.png",
					}
				 ];
				console.log(msg);
				var toPlayer={order: "update_hands", hands: hands}
				var toGroup={order: "update"}
				fulfill({player:toPlayer,group:toGroup});
				break;
			case "send_chat":
			
				Users.findByEmail(msg.email).then( user => {
				Messages.create({game_id:msg.game_id, user_id:user.id, message: msg.message}).then( success => {
					Messages.listMsgByGameId(msg.game_id).then( msgs => {
						console.log(msgs);
						var toPlayer = {messages: msgs, order: "update_chat"};
						var toGroup = {messages: msgs, order: "update_chat"};
						fulfill({player:toPlayer, group:toGroup});
					});
				});
				}).catch(error => {
					console.log(error);
					reject(error);
				});
				break;
			default:
				reject();
				break;
		}
		});
}

module.exports = mockGame;
