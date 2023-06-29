const router = require("express").Router();

const {
  getAllUsers,
  createUser,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
} = require("../controllers/users");

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:userId", getUserById);
router.patch("/me", updateUserInfo);
router.patch("/me/avatar", updateUserAvatar);

module.exports = router;