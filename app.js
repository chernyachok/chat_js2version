var express = require('express');
var dotenv = require('dotenv')
var bodyParser = require('body-parser');
const path = require('path');
var socket = require('socket.io')

dotenv.config();

var app = express();

var port = process.env.PORT
var host = process.env.HOST

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')



app.get('/', (req,res)=>{
  res.sendFile(__dirname+'/views/index.html')
})


app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    err.message= 'NOT FOUND'
    next(err);
});
app.use(function(err, req, res, next) {
    res.status(err.status).send(err.message);

});

var server = app.listen(port, host, ()=>{
  console.log(host+' listening on port'+ port);
})

var usernames = []// from database

var io = socket(server)

io.sockets.on('connection', (socket)=>{
  socket.on('new user', (data, callback)=>{
    if(data === '')
      return callback("enter your username")
    if(usernames.indexOf(data) != -1)//if found
      return callback("such username already exist.")
    usernames.push(data)
    socket.username = data;
    //console.log(socket.username)
    updateUsernames();
    return callback(null, true)
  })

  socket.on('send message', (data)=>{
    //console.log(socket.id)

    io.sockets.emit('new message', {newMessage: data, socketUsername: socket.username})//to all socket.id`s
  })

  socket.on('typing', function(){
    socket.broadcast.emit('typing', socket.username)
  })

  let updateUsernames = ()=>{
    io.sockets.emit('usernames', usernames)
  }

  socket.on('disconnect', (data)=>{//reserved 'disconnct'
    usernames.splice(usernames.indexOf(socket.username),1);
    updateUsernames()
  })

})
