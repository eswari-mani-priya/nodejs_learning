var express = require('express');
const { body, validationResult } = require('express-validator');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('form', { title: 'Form-Validation', errors: req.session.errors});
  req.session.errors = null;
});

function validateConfirmPassword(req){
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if(password !== confirmPassword){
    return Error('Passwords must be same!')
  }
}

router.post('/submit', 
body('email').isEmail(),
body('password').isLength({ min: 5 }),
function(req, res, next){
  const errors = validationResult(req);
  const confirmPassword_errors = validateConfirmPassword(req);
  // console.log('Error:'+confirmPassword_errors)
  if (!errors.isEmpty()){
    req.session.errors = errors
  }
  else if(confirmPassword_errors){
    res.render('data', {data: confirmPassword_errors, stat: false})
  }
  else{
    res.render('data', {email: req.body.email, stat: true});
  }
}); 

module.exports = router;
