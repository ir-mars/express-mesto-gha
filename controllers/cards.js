const Card = require('../models/card');
const { errorHandler, notFoundErrorThrow } = require('../utils/errorHandler');
const { SUCCES_ADDED_STATUS } = require('../utils/constants');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { NotFoundError } = require('../errors/NotFoundError');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch((error) => errorHandler(error, res));
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.id)
    .populate([{ model: 'user', path: 'owner' }])
    .then((deletedCard) => {
      if (!deletedCard) {
        errorHandler(new NotFoundError('Карточка не найдена'), res);
      }
      if (deletedCard.owner._id.toString() !== req.user._id.toString()) {
        errorHandler(
          new ForbiddenError(
            'Нельзя удалять карточки, созданные другими пользователями'
          ),
          res
        );
        return;
      }
      Card.findByIdAndDelete(req.params.id)
        .then((card) => {
          if (card) {
            res.send(card);
          } else {
            errorHandler(new NotFoundError('Карточка не найдена'), res);
          }
        })
        .catch((error) => errorHandler(error, res));
    });
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