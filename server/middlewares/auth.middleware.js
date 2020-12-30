const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
  guard: async (req, res, next) => {
    let token;

    try {
      if (req.cookies.token) {
        token = req.cookies.token;
      } else {
        const error = new Error('Bạn cần phải đăng nhập.');
        error.status = 401;
        throw error;
      }

      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.id);

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  },
};
