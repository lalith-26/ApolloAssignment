const { UserService } = require('../services/user-service');

class ProfileController {

  constructor(db) {
    this.userService = new UserService(db);
    this.getUserProfile = this.getUserProfile.bind(this);
  }

  getUserProfile(req, res, next) {
    if(req.token) {
      this.userService
      .getUserProfileByToken(req.token)
      .then(user => res.status(200).json({ name: user.name, email: user.email, id: user._id }))
      .catch((err)=>{ next(err) });
    } else {
      const err =  new Error('Invalid token');
      err.statusCode = 401;
      throw err;
    } 
  }
}

module.exports.ProfileController = ProfileController;
