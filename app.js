'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');

const mongoDb = require('mongodb');
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bearerToken());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/app_client'));

mongoDb
.connect(process.env.MONOGO_URL || 'mongodb://@localhost:27017/local')
.then(db => {
  app.set('database', db);
  require('./api/routes')(app);
  app.listen(port);
  console.log('Started server on port ' + port);
  return app;
})
.catch(console.error);

module.exports = app;
