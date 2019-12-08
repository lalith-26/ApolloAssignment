const { UserService } = require('../services/user-service');
const { InputValidator } = require('../validators/input-validator');

class AuthenticationController {
  constructor(db) {
    this.userService = new UserService(db);
    this.registerUser = this.registerUser.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  registerUser(req, res, next) {
    const { name, email, password } = req.body;

    Promise.all([
      InputValidator.validateName(name),
      InputValidator.validatePassword(password),
      InputValidator.validateEmail(email)
    ])
    .then(() => {   
      return this
      .userService
      .registerUser(name, email, password)
      .then((token) => {
        res.status(201).json({message:"User successfully created", token});
        return;
      })
      .catch(err => next(err)); 
    })
    .catch(err => next(err));
  }

  logIn(req, res, next) {
    const { email, password } = req.body;

    Promise.all([
      InputValidator.validatePassword(password),
      InputValidator.validateEmail(email)
    ])
    .then(() => {   
      return this
      .userService
      .logIn(email, password)
      .then(token => {
        res.json({ token });
        return;
      })
      .catch(err => next(err));
    })
    .catch(err => next(err));
  }

  logOut(req, res, next) {
    if(req.token) {
      return this
      .userService
      .logOut(req.token)
      .then(() => {
        res.json({});
        return;
      })
      .catch(err => next(err));
    } else next(new Error('Invalid token'));
  }
}

module.exports.AuthenticationController = AuthenticationController;
