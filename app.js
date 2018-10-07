var express = require('express');
var dotenv = require('dotenv')
var bodyParser = require('body-parser');
const path = require('path');


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
  res.render('index')
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

app.listen(port, host, ()=>{
  console.log(host+' listening on port'+ port);
})
