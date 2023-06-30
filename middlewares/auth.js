const jwt = require('jsonwebtoken');
const { JWT_CODE } = require('../utils/constants');
const { ERROR_UNAUTHORIZED } = require('../utils/errorHandler');

const messageErrorUnauth = 'Необходима авторизация';
module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(ERROR_UNAUTHORIZED).send({ message: messageErrorUnauth });
  }
  let payload;
  try {
    payload = jwt.verify(token, JWT_CODE);
  } catch (err) {
    return res.status(ERROR_UNAUTHORIZED).send({ message: messageErrorUnauth });
  }
  req.user = payload;
  return next();
};