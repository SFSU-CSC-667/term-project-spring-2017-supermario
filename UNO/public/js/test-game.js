
const socket = io();

var gameId = 5;
var userId = 10;
var cardId = 0;
var gameState = 0;
var cards = {};
var toServer = { word: {}, game_id: gameId, user_id: userId, gameState: gameState };
/*
var readyPlay, seat_count, seat_turn, top_discard, direction, players;  // shared information of the game
var timeOut, mySeat, myTurn, myCards, pickedCard;
var playable = { color: "", number: "" }  // color: 'r', 'b', 'g', or 'y'; number: 0~9, 13, or 14
var players={}, myInfo, whoStart, roundEnd, gameEnd;
var thisCard
*/
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
  init()

  /* chat room needed to be solved chat channel */
  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
    window.scrollTo(0, document.body.scrollHeight)
  });
  
  socket.on('game', function(msg) {
    console.log(JSON.stringify(msg))
    if (msg.hasOwnProperty("user_id") && msg.user_id === userId) {
      userHandler(msg)
    } else if (msg.hasOwnProperty("group") && msg.group === gameId) {
      groupHandler(msg)
    }
  })


  // Change the card image by click the option
  var select = '<option></option>'
  for (i=0; i<108; i++) {
    select += `<option value=${i}>${i}</option>`
  }
  document.getElementById("selectCard").innerHTML = select
  
  var st = $('#selectCard')

  st.change(function() {
    cardId = $(this).val()
    console.log('card image = ', cards[cardId].image_url)
    document.getElementById('card').src='images/cards/' + cards[cardId].image_url;
  })
  
})

function userHandler(msg) {
  var result = {};
  var order = msg.order;
  switch (order) {
    case 'none':
      result = 'none';
      break;
    case 'pickColor':
      result = 'pick a color';
      break;
    case 'init':
      result = 'init'
      cards = msg.cardsTable;
      break;
    case 'exit':
      result = 'exit';
      break;
    default:
      result = 'no matched order';
  }
  console.log('client result: ', result)
  document.getElementById('userChannel').innerHTML = JSON.stringify(msg);
}

function groupHandler(msg) {
  if (msg.refresh === 'refresh') {
    // send refresh request to server
  }
  document.getElementById('groupChannel').innerHTML = JSON.stringify(msg);
}

function post(wd) {
  document.getElementById("tosend").innerHTML = "To send: " + wd;
  toServer.word = wd
  sendOut(toServer);
}

function sendOut(outPackage) {
  socket.emit('game', outPackage);
}


function init() {
  post('init')
}


function showHandCards() {
  var cardsInhand = [3, 10, 30, 50, 89, 103]
  var x = 0, image = '', oneCard
  cardsInhand.forEach(a => {
    oneCard = 'images/cards/' + cards[a].image_url
    image += `<img class="card" src="${oneCard}" ondragend="post(${a})"
                onclick="post(${a})" alt='card_id: ${a}'> `
    x += 15
  })
  console.log(image)
  document.getElementById('handCards').innerHTML = image
}
