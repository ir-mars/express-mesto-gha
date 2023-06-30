const { ERROR_NOT_FOUND } = require('../utils/constants');

class NotFoundError extends Error {
  constructor(message = 'Не найдено') {
    super(message);
    this.statusCode = ERROR_NOT_FOUND;
  }
}
module.exports = {
  NotFoundError,
};