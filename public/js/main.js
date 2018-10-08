$(document).ready(function(){

  var socket = io.connect()
  var messageForm = $('#messageForm');
  var message  = $('#message')//message
  var chatWindow = $('#chatWindow');//push to window
  var chatWindowList = $("#newMessage")
  var usernameForm  = $('#usernameForm');
  var users = $('#users');
  var username = $('#username');
  var errors = $('#errors');

  messageForm.submit(function(e){
    e.preventDefault()
    socket.emit('send message', message.val())
    message.val('')
  })


  usernameForm.submit(function(e){
    e.preventDefault()
    socket.emit('new user', username.val(), (err,data)=>{
      //its callback
      if(data){
        $('#namesWrapper').hide();
        $('#mainWrapper').show()

      }else{
        errors.html(err);
      }
    })
    username.val('')
  })

  message.on('keyup',function(){
    socket.emit('typing')
  })

  socket.on('usernames', (usernames)=>{
    $('#usernames').html('<h4>Users online:</h4>')
    $.each(usernames,function(index,element){
      $('#usernames').append("<li>"+element+"</li>")
    })
  })

  socket.on('new message', (data)=>{
    $('#typing').html('')
    chatWindowList.append(`<li><b>${data.socketUsername}: </b>${data.newMessage}</li>`);
  })

  socket.on('typing', (data)=>{
    $('#typing').html(`<i>${data} is typing...</i>`)
  })


})
