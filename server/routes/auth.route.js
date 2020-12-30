const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const authController = require('../controllers/auth.controller');
const validator = require('../helpers/validator');

router.post(
  '/register',
  validator.register,
  validator.handleValidationErrors,
  authController.register
);
router.post(
  '/login',
  validator.login,
  validator.handleValidationErrors,
  authController.login
);
router.post('/logout', auth.guard, authController.logout);
router.get('/user', auth.guard, authController.getCurrentUser);
router.get('/is-auth', authController.isAuthenticated);
router.post('/send-mail', authController.sendMail);

module.exports = router;
