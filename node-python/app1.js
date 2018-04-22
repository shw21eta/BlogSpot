var http = require("http");
var querystring = require('querystring')

postData = {   //the POST request's body data
   'string':'ssup dude'
};

postBody = querystring.stringify(postData);

var options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/',
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
      'Content-Length': postBody.length
  }
};
var req = http.request(options, function(res) {
  console.log('Status: ' + res.statusCode);
  console.log('Headers: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (body) {
    console.log('Body: ' + body);
  });
});
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
// write data to request body
req.write(postBody);
req.end();
