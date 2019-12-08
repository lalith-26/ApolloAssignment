class InputValidator {


  static validateName(name) {
    if(typeof name === 'string' && name.length > 0){
      return Promise.resolve();
    }
    return Promise.reject({ statusCode: 400, message: 'Name must be a valid non empty string.' });
  }

  static validateEmail(email) {
    if(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)){
      return Promise.resolve();
    }
    return Promise.reject({ statusCode: 400, message: `${email} is not a valid email` });
  }

  // atleast one lowercase and  atleast 6 characters
  static validatePassword(password) {
    if(/(?=.*[a-z]).{6,}/.test(password)){
      return Promise.resolve();
    }
    return Promise.reject({ statusCode: 400, message: 'password must be a valid non empty string ' });
  }
}

module.exports.InputValidator = InputValidator;
