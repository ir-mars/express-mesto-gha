const Card = require('../models/card');

const {
  errorHandler,
  notFoundErrorThrow,
} = require('../utils/errorHandler');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then(cards => res.send({ data: cards }))
    .catch((error) => errorHandler(error, res));

};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(card => {
      card
        ? res.send(card)
        : notFoundErrorThrow()
    })
    .catch((error) => errorHandler(error, res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then(card => res.send({ data: card }))
    .catch((error) => errorHandler(error, res));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then(card => {
      card
        ? res.send({ data: card })
        : notFoundErrorThrow()
    })
    .catch((error) => errorHandler(error, res));

};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then(card => {
      card
        ? res.send({ data: card })
        : notFoundErrorThrow()
    })
    .catch((error) => errorHandler(error, res));
};