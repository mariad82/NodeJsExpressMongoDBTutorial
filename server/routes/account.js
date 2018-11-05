var express = require('express');
var router = express.Router();
var User = require('../models/Users');

router.get('/login', getLoginForm);
router.get('/register', getRegisterationForm);
router.post('/login', login);
router.post('/register', register);

/**
 * The funciton is a middleware
 *
 * @param req - The request object
 * @param res - The response object
 * @param next
 * 
 */
function getLoginForm(req, res, next) {
  // Render the images gallery
  res.render('account/login', {
    title: "Login Form"
  });
}

function getRegisterationForm(req, res, next) {
  // Render the images gallery
  res.render('account/register', {
    title: "Registration Form"
  });
}

/**
 * The funciton is a middleware
 *
 * @param req - The request object
 * @param res - The response object
 * @param next
 * 
 */
function login(req, res, next) {

  // Check Validation
  req.checkBody('username', 'User name is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  // Validate the register form
  validateForm({
    req: req,
    res: res,
    action: "login",
    title: "Login Form",
    view: "account/register"
  });
}

/**
 * The funciton is a middleware
 *
 * @param req - The request object
 * @param res - The response object
 * @param next
 * 
 */
function register(req, res, next) {

  // Check Validation
  req.checkBody('username', 'User name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password min length : 5 characters').notEmpty().isLength({
    min: 5
  });
  req.checkBody('password2', 'Verify password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  // Validate the register form
  validateForm({
    req: req,
    res: res,
    action: "register",
    title: "Registration Form",
    view: "account/register"
  });


}

function validateForm(data) {
  let errors,
    errorMessages;

  // Check to see if we have errors
  errors = data.req.validationErrors();

  // Convert the errors from array to object
  errors && errors.forEach(function (error) {
    // Init the error object
    errorMessages = errorMessages || {};
    errorMessages[error.param] = error;
  });

  // Send the reply
  if (1 == 0 && errorMessages) {
    data.res.render(data.view || "/", {
      title: data.title || "",
      errors: errorMessages
    });
  } else {
    processAction(data);
  }

  // Return undefined if there are no errors
  return errors ? errorMessages : undefined;

}

function processAction(data) {

  switch (data.action) {
    case "login":
      console.log('login');
      break;
    case "register":
      let user = new User(data.req.body);
      User.createUser(user)
        .then(function (err, userRecord) {
          if (!err) {
            data.res.redirect('/');
          }
        });
      break;
  }

}

module.exports = router;