const socketIo = require('socket.io');
const db = require('../../database/game');
const Users=require('../../models/users');
const Games=require('../../models/games');
const Players=require('../../models/players');
const Messages=require('../../models/messages');
const socketServer=require('../socket-server');
const MaxPlayer = 4;

				var hands=[
					{id:1,
					 image_url: "r1.png",
					},
					{id:3,
					 image_url: "r2.png",
					},
					{id:20,
					 image_url: "r_skip.png",
					},
					{id:34,
					 image_url: "y5.png",
					},
					{id:50,
					 image_url: "g0.png",
					},
					{id:96,
					 image_url: "b_reverse.png",
					},
					{id:107,
					 image_url: "wild4.png",
					},
				 ];

function mockGame(msg) {

return new Promise( function(fulfill, reject){
			
		switch(msg.action){
			case "ready":
				console.log(msg);
				var toPlayer={order: "update_hands", hands: hands}
				var toGroup={order: "update"}
				fulfill({player:toPlayer,group:toGroup});
				break;
			case "draw":
				console.log(msg);
				var toPlayer={order: "update_hands", hands: hands}
				var toGroup={order: "update"}
				fulfill({player:toPlayer,group:toGroup});
				break;
			case "play":
				console.log(msg);
				var newhands=[];
				var image_url="";
				var iterHand=0;
				hands.forEach( hand => {
					
					if(hand.id===msg.card_id){
						console.log(image_url);
						image_url=hand.image_url;
						iterHand++;
					}else{
						console.log(newhands);
						newhands.push(hand);
						iterHand++;
					}
					
					if(iterHand===hands.length){
						var toPlayer={order: "update_hands", hands: newhands}
						var toGroup={order: "update_board", card_id: msg.card_id, image_url: image_url}
						fulfill({player:toPlayer,group:toGroup});
					}
				});
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
