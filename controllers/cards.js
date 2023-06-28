const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate([ 'owner', 'likes' ])
    .then(cards => res.send({ data: cards}))
    .catch(() => res.status(500).send({
      message: 'Ошибка'
    }))
};

/*module.exports.deleteCard = (req, res) => {
  const _id = req.card._id;
  const ownerId = req.user._id; 
  Card.findById({ _id })
    .populate([ 'owner'])
    .then((card) => {
      return Card.findByIdAndRemove({ _id })
      .then(() => res.status(200).send({
        message: 'Карточка удалена'
      }))
    })
    .catch(() => res.status(500).send({
      message: 'Ошибка'
    }))  
};*/

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then(card => res.send({ data: card }))
    .catch(() => res.status(500).send({
      message: 'Ошибка'
    }))
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
  
  module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )