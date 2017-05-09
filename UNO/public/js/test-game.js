
const socket = io();

var gameId = 5;
var userId = 10;
var cardId = 0;
var cards;
var myId = { game_id: gameId, user_id: userId };
const GAMESERVER = 'game server';

var readyPlay, seat_count, seat_turn, top_discard, direction, players;  // shared information of the game
var timeOut, mySeat, myTurn, myCards, pickedCard;
var playable = { color: "", number: "" }  // color: 'r', 'b', 'g', or 'y'; number: 0~9, 13, or 14
var cards={}, players={}, myInfo, whoStart, roundEnd, gameEnd;

// request server for card image file names, player infos

/* Listening from server * /
socket.on('game', function(msg) {
  document.getElementById('feedback').innerHTML = msg;
});*/
/* Update */
/* Draw Scene * /
/* Check if in turn */
/* Listening player event */
/* Check timeout */
/* Event response */
// *

$(function () {
  post('init');   // get UNO cards from server

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
    default:
      result = 'no matched order';
  }
    document.getElementById('userChannel').innerHTML = JSON.stringify(msg);
}

function groupHandler(msg) {
    document.getElementById('groupChannel').innerHTML = JSON.stringify(msg);
}

function post(word) {
  document.getElementById("tosend").innerHTML = "To send: " + word;
  sendOut(Object.assign({"word": word}, myId));
}

function sendOut(outPackage) {
  socket.emit(GAMESERVER, outPackage);
}

function showCard(cardId) {
  document.getElementById('card1').src=cards[cardId].image_url;
}
