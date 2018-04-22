var request = require('request');

request({
    method: 'POST',
    url: 'http://127.0.0.1:5000',
    // body: '{"foo": "bar"}'
    json: {"strdata": "ssup dude"}
}, (error, response, body) => {
    console.log(error);
    // console.log(response);
    console.log(body);
});
