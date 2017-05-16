
const socket = io();

const GAMESERVER = 'mock game server';

var readyPlay, seat_count, seat_turn, top_discard, direction, players;  // shared information of the game
var timeOut, mySeat, myTurn, myCards, pickedCard;
var playable = { color: "", number: "" }  // color: 'r', 'b', 'g', or 'y'; number: 0~9, 13, or 14
var cards={}, players={}, myInfo, whoStart, roundEnd, gameEnd;
// request server for card image file names, player infos

var hands=`{{#each hands}}
		  <img src="/images/cards/{{this.image_url}}" alt="#" width="150" height="150" onclick="play_hand('{{this.id}}')">
		  {{/each}}`

var chat=`{{#each messages}}
		<li>{{this.nick_name}}: {{this.message}}   {{this.post_time}}</li>
		{{/each}}`;

var hands_template=Handlebars.compile(hands);
var chat_template=Handlebars.compile(chat);

$(function () {
  /* chat room needed to be solved chat channel */
  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
    window.scrollTo(0, document.body.scrollHeight);
  });
  
  socket.on(GAMESERVER, function(msg) {
    console.log(JSON.stringify(msg));
    groupHandler(msg);
  });

  socket.on(GAMESERVER, function(msg) {
    console.log(JSON.stringify(msg));
    userHandler(msg);
  });
});
// below function are include in to jquery block
function userHandler(msg) {
  result = {};
  var order = msg.order;
  switch (order) {
    case 'pickColor':
      result = 'pick a color';
      break;
    case 'init':
      cards = msg.content;
      result = cards[10].image_url;
      break;
    case 'exit':
      result = 'exit';
      break;
	case 'update_hands':
		html = hands_template(msg);
		document.getElementById('player_hands').innerHTML = html;
		break;
	case 'update_chat':
		html = chat_template(msg);
		document.getElementById('messages').innerHTML = html;
	    window.scrollTo(0, document.body.scrollHeight);
		break;
	case 'update':
		break;
    default:
      result = 'no matched order';
  }
   // document.getElementById('userChannel').innerHTML = JSON.stringify(msg);
}

function groupHandler(msg) {
    //document.getElementById('groupChannel').innerHTML = JSON.stringify(msg);
}


function sendOut(outPackage) {
  socket.emit(GAMESERVER, outPackage);
}

function showCard(cardId) {
  document.getElementById('card1').src=cards[cardId].image_url;
}

function draw(){
	var msg={action:"draw"};
	socket.emit(GAMESERVER,msg);
}

