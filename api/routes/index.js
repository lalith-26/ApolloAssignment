
const  { AuthenticationController } = require('../controllers/authentication');
const  { ProfileController } = require('../controllers/profile');

module.exports = (app) => {
  const authController  = new AuthenticationController(app.get('database'));
  const profileController  = new ProfileController(app.get('database'));
  
  app.post('/api/register', authController.registerUser);
  app.get('/api/profile', profileController.getUserProfile);
  app.post('/api/login', authController.logIn);
  app.get('/api/logout', authController.logOut);


  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).send({ error: err.message || 'Something wen\'t wrong' });
  })
};
