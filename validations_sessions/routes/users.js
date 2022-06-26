var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/detail', function(req, res, next) {
  res.send('This is user detail page!')
});

router.get('/data', function(req, res, next) {
  res.send('This is user data page!')
});

module.exports = router;
