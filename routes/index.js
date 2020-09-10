var express = require('express');
const mongodb = require('mongodb');

var router = express.Router();
const MongoClient = mongodb.MongoClient;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'login page' });
});
router.post('/', (req, res, next) => {
  console.log(req.body);

  MongoClient.connect('mongodb://127.0.0.1:27017', (error, client) => {

    if (error) {
      console.log('DataBase Connection Error');
    }
    else {
      client.db('database').collection('data').insertOne(req.body);
    }

  });

  res.send('gotit');
});

module.exports = router;
