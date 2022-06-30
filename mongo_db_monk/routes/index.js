var express = require('express');
var router = express.Router();
var db = require('monk')('localhost:27017/test');
var userData = db.get('user-data');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/get-data', function(req, res, next) {
  var resultArray = [];
  userData.find({}, {}, function(e, docs){
    res.render('index', {items: docs});
  });
  // var data = userData.find({});
  // data.on('success', function(docs) {
  //   res.render('index', {items: docs});
  // });
});

router.post('/insert', function(req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
  userData.insert(item);
  res.redirect('/');
});

router.post('/update', async function(req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
  var id = req.body.id;
  var item_1 = await userData.find({'_id': db.id(id)});
  console.log(item_1);
  userData.update(item_1[0], {$set: item})
  // userData.update({id: item});
  res.redirect('/');
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  // userData.remove({'_id': db.id(id)});
  userData.remove(id);
  res.redirect('/');
});

module.exports = router;
