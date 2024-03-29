const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { CODE_JWT, SUCCES_ADDED_STATUS } = require("../utils/constants");

const { notFoundErrorThrow } = require("../middlewares/errorHandler");

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hashCode) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hashCode,
      }).then((user) => res.status(SUCCES_ADDED_STATUS).send(user))
    )
    .catch(next);
};

module.exports.login = (req, res, next) => {
  User.findUserByCredentials(req.body.email, req.body.password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, CODE_JWT, { expiresIn: "7d" });
      res
        .cookie("token", token, {
          maxAge: 604800, // неделя в секундах)
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: "Вы авторизованы!" });
    })
    .catch(next);
};
function getUserById (_id, res, next) {
  User.findById({ _id })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        notFoundErrorThrow();
      }
    })
    .catch(next);
}
module.exports.getUserData = (req, res, next) => {
  const { _id } = req.user;
  getUserById(_id, res, next);
};

module.exports.getUserId = (req, res, next) => {
  const _id = req.params.id;
  getUserById(_id, res, next);
};

function updateUserData (req, res, next, dataToUpdate) {
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, dataToUpdate, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        notFoundErrorThrow();
      }
    })
    .catch(next);
}

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const dataToUpdate = { name, about };
  updateUserData(req, res, next, dataToUpdate);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const dataToUpdate = { avatar };
  updateUserData(req, res, next, dataToUpdate);
};
module.exports.logout = (req, res) => {
  res.clearCookie("token").send({ message: "Вы вышли" });
};
