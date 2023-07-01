const jwt = require("jsonwebtoken");
const { CODE_JWT } = require("../utils/constants");
const { UnauthorizedError } = require("../errors/UnauthorizedError");
const { errorHandler } = require("./errorHandler");

function generateErrorAuth (res) {
  errorHandler(new UnauthorizedError("Необходима авторизация"), res);
}
module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    generateErrorAuth(res);
    return;
  }
  let payload;
  try {
    payload = jwt.verify(token, CODE_JWT);
    req.user = payload;
  } catch (err) {
    generateErrorAuth(res);
  }
  next();
};

// module.exports = (req, res, next) => {
//   const { token } = req.cookies;
//   if (!token) {
//     // return next(throw new UnauthorizedError("Необходима авторизация"));
//   }

//   try {
//     req.user = jwt.verify(token, CODE_JWT);
//     return next();
//   } catch (err) {
//     console.log('errss');
//     return next(new UnauthorizedError("Необходима авторизация"));
//   }
// };
