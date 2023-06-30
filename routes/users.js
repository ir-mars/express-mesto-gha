const router = require('express').Router();

const {
  validateUserInfo,
  validateUserAvatar,
} = require('../validate/userValidate');

const {
  getAllUsers,
  getUserData,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/me', getUserData);
router.patch('/me', validateUserInfo, updateUserInfo);
router.patch('/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = router;