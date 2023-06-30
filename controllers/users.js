const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { SUCCES_ADDED_STATUS } = require('../utils/constants');
const { JWT_CODE } = require('../utils/constants');

const {
  errorHandler,
  notFoundErrorThrow,
  ERROR_BAD_REQUEST,
} = require('../utils/errorHandler');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((error) => errorHandler(error, res));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  
  bcrypt.hash(password, 10)
    .then ((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
     })       
      .then((user) => res.status(SUCCES_ADDED_STATUS).send(user))
      .catch((error) => errorHandler(error, res)));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_CODE,
        { expiresIn: '7d' }
      );
      res
        .cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send ({ token }); ///////////////////////////////////
    })
    .catch((error) => {
      res
        .status(ERROR_BAD_REQUEST).send({ message: error.message });
    });
};

module.exports.getUserData = (req, res) => {
  const { _id } = req.user;
  
  User.findById({ _id })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        notFoundErrorThrow();
      }
    })
    .catch((error) => errorHandler(error, res));
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        notFoundErrorThrow();
      }
    })
    .catch((error) => errorHandler(error, res));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        notFoundErrorThrow();
      }
    })
    .catch((error) => errorHandler(error, res));
};

module.exports.logout = (req, res) => {
  res.clearCookie('token').send({ message: 'Вы вышли' });
};