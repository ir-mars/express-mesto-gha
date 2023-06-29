const ERROR_INTERNAL_SERVER = 500;
const ERROR_NOT_FOUND = 404;
const ERROR_BAD_REQUEST = 400;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

function errorHandler (error, response) {
  const { name } = error;

  if (name === 'CastError' || name === 'ValidationError') {
    return response
      .status(ERROR_BAD_REQUEST)
      .send({ message: 'Переданы некорректные данные' });
  }
  if (name === 'NotFoundError') {
    return response
      .status(ERROR_NOT_FOUND)
      .send({ message: 'Данные не найдены' });
  }
  return response
    .status(ERROR_INTERNAL_SERVER)
    .send({ message: `Произошла ошибка сервера ${ERROR_INTERNAL_SERVER}` });
}

function notFoundErrorThrow () {
  throw new NotFoundError();
}

module.exports = {
  ERROR_INTERNAL_SERVER,
  ERROR_NOT_FOUND,
  ERROR_BAD_REQUEST,
  errorHandler,
  notFoundErrorThrow,
};