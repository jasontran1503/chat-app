const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
const uploader = require('../helpers/upload');

router.get('/profile', userController.getUserProfile);
router.get('/search', auth.guard, userController.searchUser);
router.post('/follow', auth.guard, userController.follow);
router.post('/unfollow', auth.guard, userController.unfollow);
router.get('/followers', auth.guard, userController.getUserFollowerList);
router.get('/following', auth.guard, userController.getUserFollowingList);
router.post(
  '/upload',
  auth.guard,
  uploader.single('image'),
  userController.uploadImageToCloudinary
);

module.exports = router;
