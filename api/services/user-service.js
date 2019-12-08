const uuid = require('uuid');
const crypto = require('crypto');

function hash(str) {
  const hmac = crypto.createHmac('sha256', process.env.HASH_SECRET || 'test-secret');
  hmac.update(str);
  return hmac.digest('hex');
}

function createToken() {
  return 'token.' + uuid.v4().split('-').join('');
}

class UserService {
  constructor(db) {
    this.db = db;
    this.getUserProfileByToken = this.getUserProfileByToken.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  /**
   * Registers a user and returns it's token
   * @param {String} name
   * @param {String} email
   * @param {String} password
   * @return {Promise} resolves to user's token or rejects with Error that has statusCodes
   */
  registerUser(name, email, password) {
    return new Promise((resolve,reject)=>{
      this.db
      .collection('Users')
      .findOne({ email })
      .then(user => {
        if (!user) {
          const token = {
            alg:'sha256',
            data: createToken(),
            issuedAt: new Date().getTime()
          }
          this.db
          .collection('Users')
          .insertOne({ name, email, password: hash(password), token })
          .then(() => { resolve(token.data); })
          .catch((err) => reject('Unable to create user'));
        } else {
          const err = new Error('User already exists');
          err.statusCode = 400;
          throw err;
        }
      })
      .catch((err) => reject(err));
    }); 
  }

  /**
   * Gets a user profile by token
   * @param {String} token
   * @return {Promise} that resolves to object with email and name of user or rejects with error
   */
  getUserProfileByToken(token) {
    return this.db.collection('Users')
    .findOne({ 'token.data': token })
    .then(user => {
      if (user) {
        return user;
      }
      const err = new Error('Please login, session might be expired ');
      err.statusCode = 401;
      throw err;
    }).catch((err) => { throw new Error(err); })
  }

  /**
   * Log in a user to get his token
   * @param {String} email
   * @param {String} password
   * @return {Promise} resolves to token or rejects to error
   */
  logIn(email, password) {
    return new Promise((resolve,reject) => {
      this.db.collection('Users')
      .findOne({ email, password: hash(password) })
      .then(user => {
        if (user) {
          const token = {
            alg:'sha256',
            data: createToken(),
            issuedAt: new Date().getTime()
          }
          this.db.collection('Users')
          .updateOne({ _id: user._id }, { $set: { token } })
          .then(() => { resolve(token.data); })
          .catch((err) => reject(err));
        }
      })
      .catch((err) => reject(err));
    });
   
  }

  logOut(token) {
    return this.db.collection('Users')
    .updateOne({ 'token.data': token }, { $unset: { token: {} } })
  }
}

module.exports.UserService = UserService;


