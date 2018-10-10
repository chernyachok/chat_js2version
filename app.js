var express = require('express');
var dotenv = require('dotenv')
var bodyParser = require('body-parser');
const path = require('path');
var socket = require('socket.io')
var shortid = require('shortid')
var expressHbs = require('express-handlebars')
var db = require('./config/lowdb')
//console.log(db.get('info').value())
//console.log(shortid.generate())

dotenv.config();

var app = express();

var port =  process.env.PORT
var host =process.env.HOST

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', expressHbs({ extname: 'hbs'}));
app.set('view engine', 'hbs')


var msgs = db.get('info').value() //all rows
//console.log(msgs)
//console.log(db.get('info').remove({username: db.get('info[0]').value().username}).write() ) //size( ) ==length

app.get('/', (req,res)=>{
  res.render('index', {msgs: msgs})
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

var server = app.listen(port)

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
    //console.log(db.)
    var count = db.get('info').value().length;
    db.get('info').push({_id: shortid.generate() ,username: socket.username, msg: data}).write()
    if(msgs.length > 5){
        db.get('info').remove({_id: db.get('info[0]').value()._id}).write()
        //db.get('info').remove({username: 'ben'}).write()
    }
    io.sockets.emit('new message', {newMessage: data, socketUsername: socket.username, current_length: count})//to all socket.id`s
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
