var express=require('express');
var http = require("http");
var request = require('request');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var expressSession=require("express-session");

var app=express();
app.set('view engine','ejs');
app.use('/assets',express.static('assets'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://sh221:221bbakerstreet@ds149138.mlab.com:49138/blogapp');


app.get('/', function(req,res){

  allblogs=['Linda talks about how machine learning models can be used as effective substitutes for classic data structures.','Dylan talks to us about how he started programming, challenges he has faced and what keeps him hooked till this day.','Olivia talks about how machine learning models can be used as effective substitutes for classic data structures.','Sam talks to us about how he started programming and what keeps him hooked till this day.'];


  res.render('index.ejs',{allblogs:allblogs});
});

app.get('/detail',function(req,res){
  res.render('detail.ejs');
});

app.post('/',function(req,res){
  console.log('post request');
  request({
      method: 'POST',
      url: 'http://127.0.0.1:5000',
      // body: '{"strdata": "ssup dude"}'
      json: {"article": req.body.article}
  }, (error, response, body) => {
      console.log(error);
      //console.log(response);
      console.log(body);
  });
  res.send('Post seccessful');
});


app.listen(4480);
