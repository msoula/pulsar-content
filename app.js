var express = require('express');
var path = require('path');
var logger = require('morgan');
var app = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

var PATH = process.argv[2] || './files';
var fileTree = require('./app/bootstrap.js')(PATH);
app.use(express.static(PATH));

app.get('/files.json', function(req, res, next) {
  res.json(fileTree);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  if (err.status !== 404)
    console.error(err);
  res.status(err.status || 500);
  res.send("Error " + err.status || 500);
});


var port = 80;
app.listen(port);
console.log('Magic happens at ' + port);


/**
 A propos
 Cover
 Couleur
 */
