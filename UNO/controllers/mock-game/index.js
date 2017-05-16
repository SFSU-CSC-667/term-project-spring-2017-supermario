const socketIo = require('socket.io');
const db = require('../../database/game');
const Users=require('../../models/users');
const Games=require('../../models/games');
const Players=require('../../models/players');
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
			default:
				
				reject();
				break;
		}
		});
}

module.exports = mockGame;
