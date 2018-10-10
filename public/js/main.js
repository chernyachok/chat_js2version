$(document).ready(function(){

  var canPublish = true;
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
    if(canPublish){
      socket.emit('typing')
    }
    canPublish = false;
    setTimeout(()=>{
      canPublish = true;
    },1000)

  })

  socket.on('usernames', (usernames)=>{
    $('#usernames').html('<h4>Users online:</h4>')
    $.each(usernames,function(index,element){
      $('#usernames').append("<li>"+element+"</li>")
    })
  })

  socket.on('new message', (data)=>{
    $('#typing').html('')
    if(data.current_length<5){
        $('#newMessage').append(`<li id="position${data.current_length}"><b>${data.socketUsername}: </b>${data.newMessage}</li>`)
    }else{
        for(let i= 0; i< data.current_length; i++){
          if(i == data.current_length-1){
            $('#position'+i).html(`<b>${data.socketUsername}: </b>${data.newMessage}`)
            break;
          }
          $('#position'+i).html($('#position'+(i+1) ).html())
        }
      }
  })

  socket.on('typing', (data)=>{
    $('#typing').html(`<i>${data} is typing...</i>`)
  })


})
