var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3333;
app.listen(port);
console.log('Listening on port', port);
