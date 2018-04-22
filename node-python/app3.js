var express=require('express');
var http = require("http");
var request = require('request');
var bodyParser = require('body-parser');

var app=express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req,res){
  var url="http://127.0.0.1:5000";
  var newreq=http.get(url,function(response){
    console.log('get request');
    var buffer = "",
        data,
        route;

    response.on("data", function (chunk) {
        buffer += chunk;
    });

    response.on("end", function (err) {
        // finished transferring data
        // dump the raw data
        console.log(buffer);
        console.log("\n");
        data = JSON.parse(buffer);
        str = data.string;

        console.log("String " + str);
    });
  });
  res.sendFile(__dirname+'/views/index.ejs');
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

app.listen(3480);
