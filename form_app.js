const express = require('express');
app = express();
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/indexform.html');
});

app.post('/', urlencodedParser, (req, res) => {
    console.log('Got body:', req.body);
    res.sendStatus(200);
});

app.listen(8000);