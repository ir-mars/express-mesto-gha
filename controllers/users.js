const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Ошибка' }))
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;  
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Ошибка' }))
};

module.exports.getUserById = (req, res) => {
  /*console.log(req.user._id);*/
  const _id = req.user._id;
  User.findById({ _id })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Ошибка' }))
}

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  /*const _id = req.user._id;*/
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Ошибка' })) 
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  /*const _id = req.user._id;*/
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Ошибка' }))
};