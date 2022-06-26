var express = require('express');
var router = express.Router();
var { MongoClient, ObjectId } = require('mongodb');

var assert = require('assert');

var url = 'mongodb://localhost:27017';


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/get-data', function(req, res, next) {
  var resultArray = [];
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    let db = client.db('test');
    var cursor = db.collection('user-data').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function(){
      client.close();
      res.render('index', {items: resultArray});
    });
  });
});

router.post('/insert', function(req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
  
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    let db = client.db('test')
    db.collection('user-data').insertOne(item, function(err, result) {
      assert.equal(null, err);
      console.log('Item inserted!');
      client.close();
    });
  });

  res.redirect('/');

});

router.post('/update', function(req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
  var id = req.body.id;

  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    let db = client.db('test')
    db.collection('user-data').updateOne({"_id": ObjectId(id)}, {$set: item}, function(err, result) {
      assert.equal(null, err);
      console.log('Item inserted!');
      client.close();
    });
  });
  res.redirect('/');
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    let db = client.db('test')
    db.collection('user-data').deleteOne({"_id": ObjectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Item Deleted!');
      client.close();
    });
  });
  res.redirect('/');

});

module.exports = router;
