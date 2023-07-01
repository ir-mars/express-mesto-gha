const router = require("express").Router();
const routerUsers = require("./users");
const routerCards = require("./cards");
const { login, createUser } = require("../controllers/users");
const { validateRegister, validateLogin } = require("../validate/userValidate");
const { NotFoundError } = require("../errors/NotFoundError");
const { errorHandler } = require("../middlewares/errorHandler");
const auth = require("../middlewares/auth");

function notfoundHandler (req, res) {
  errorHandler(new NotFoundError(), res);
}
router.post("/signin", validateLogin, login);
router.post("/signup", validateRegister, createUser);
router.use(auth);
router.use("/users", routerUsers);
router.use("/cards", routerCards);
router.use("*", notfoundHandler);
router.use((err, _, res, next) => {
  errorHandler(err, res);
});
module.exports = router;
