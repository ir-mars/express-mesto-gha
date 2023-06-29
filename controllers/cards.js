const Card = require("../models/card");
const { errorHandler, notFoundErrorThrow } = require("../utils/errorHandler");

const SUCCES_ADDED_STATUS = 201;

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate(["owner", "likes"])
    .then((cards) => res.send({ data: cards }))
    .catch((error) => errorHandler(error, res));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.id)
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        notFoundErrorThrow();
      }
    })
    .catch((error) => errorHandler(error, res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(SUCCES_ADDED_STATUS).send({ data: card }))
    .catch((error) => errorHandler(error, res));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      const response = card ? { data: card } : notFoundErrorThrow();
      res.send(response);
    })
    .catch((error) => errorHandler(error, res));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      const response = card ? { data: card } : notFoundErrorThrow();
      res.send(response);
    })
    .catch((error) => errorHandler(error, res));
};