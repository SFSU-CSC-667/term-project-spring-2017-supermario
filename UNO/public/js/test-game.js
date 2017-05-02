const socket = io();
$(function () {
//  var socket = io();

  /* chat room need to solve chat channel */
  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('chat message', function(msg){
    if(msg === '9999') msg = 'it is string 9999';
    $('#messages').append($('<li>').text(msg));
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on('game', function(msg) {
    document.getElementById('feedback').innerHTML = msg;
  })
});

//        document.body.onload = addElement;
          /* This part tempt to deal with game */
          /* Set up game */
/*        $(function addElement() {
          const cardpath = '/images/cards/';
          var card_inhand = {};
          card_inhand = {'2': 'r1.png', '5': 'r3.png', '80': 'b3.png'};

          /* Listening from server * /

          socket.on('game', function(msgy){
            if(msgy === '9999') msgy = 'it is string 9999';
            $('#messages').append($('<li>').text(msgy));
            window.scrollTo(0, document.body.scrollHeight);
          });
*/
          /* Update */
          /* Draw Scene * /
          for (var prop in card_inhand) {
            var newImg = document.createElement("img", {id: prop, alt: "img:"+prop});
            var currentDiv = document.getElementById("board");
            document.body.insertBefore(newImg, currentDiv);
          } */
          /* Check if in turn */
          /* Listening player event */
          /* Check timeout */
          /* Event response */

//        });

function action(tagId) {
  var msg = document.getElementById(tagId).id;
  document.getElementById("tosend").innerHTML = "You are going to send:" + msg;
  socket.emit('game', msg);
}