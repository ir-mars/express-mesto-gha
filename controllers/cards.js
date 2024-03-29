const { ForbiddenError } = require("../errors/ForbiddenError");
const Card = require("../models/card");
const { SUCCES_ADDED_STATUS } = require("../utils/constants");
const { notFoundErrorThrow } = require("../middlewares/errorHandler");

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate(["owner", "likes"])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  /* const _id = req.card._id; */
  Card.findById(req.params.id)
    .populate([{ model: "user", path: "owner" }])
    .then((deletedCard) => {
      if (!deletedCard) {
        notFoundErrorThrow();
      }
      if (deletedCard.owner._id.toString() !== req.user._id.toString()) {
        throw new ForbiddenError(
          "Нельзя удалять карточки, созданные другими пользователями"
        );
      }
      return deletedCard
        .deleteOne()
        .then((card) => {
          if (card) {
            res.send(card);
          } else {
            notFoundErrorThrow();
          }
        })
        .catch(next);
    })
    .catch(next);
};
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(SUCCES_ADDED_STATUS).send({ data: card }))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      const response = card ? { data: card } : notFoundErrorThrow();
      res.send(response);
    })
    .catch(next);
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      const response = card ? { data: card } : notFoundErrorThrow();
      res.send(response);
    })
    .catch(next);
};
