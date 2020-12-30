const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

module.exports = {
  /**
   * Register
   * @route POST api/auth/register
   * @body email, username, password, confirmPassword
   */
  register: async (req, res, next) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    try {
      const userFoundByEmail = await User.findOne({ email });
      const userFoundByName = await User.findOne({ username });

      if (userFoundByEmail) {
        throw new Error('Email đã tồn tại.');
      }
      if (userFoundByName) {
        throw new Error('Username đã tồn tại.');
      }

      const user = await User.create({ email, username, password });

      return res.status(200).json({
        success: true,
        message: 'Đăng kí thành công.',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Login
   * @route POST api/auth/login
   * @body email, password
   */
  login: async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Đăng nhập thất bại.');
      }
      const isMatch = await user.matchPassword(password);
      if (isMatch) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });

        const options = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
          ),
          httpOnly: true,
        };

        return res.status(200).cookie('token', token, options).json({
          success: true,
          message: 'Đăng nhập thành công.',
          data: token,
        });
      } else {
        throw new Error('Đăng nhập thất bại.');
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Log out
   * @route POST api/auth/logout
   */
  logout: async (req, res, next) => {
    res.clearCookie('token');

    return res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công.',
    });
  },

  /**
   * Get current user
   * @route GET api/auth/user
   */
  getCurrentUser: async (req, res, next) => {
    const user = req.user;

    try {
      if (!user) {
        throw new Error('Không tìm thấy user.');
      }
      return res.status(200).json({
        success: true,
        message: 'Thành công.',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Authenticated
   * @route GET api/auth/is-auth
   */
  isAuthenticated: async (req, res, next) => {
    try {
      const isAuth = req.cookies.token ? true : false;

      return res.status(200).json({
        success: true,
        message: '',
        data: isAuth,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Send mail
   * @route POST api/auth/send-mail
   * @body email
   */
  sendMail: async (req, res, next) => {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'xuansontran1503@gmail.com',
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const options = {
        from: 'xuansontran1503@gmail.com',
        to: req.body.email,
        subject: 'Thanks for joining!!!',
        html: `<div style='padding: 10px; background-color: #003375'>
                    <div style='padding: 10px; background-color: white;'>
                        <h4 style='color: #0085ff'>Hello anh em</h4>
                    </div>
                </div>`,
      };

      const info = transporter.sendMail(options);
      if (!info) {
        throw new Error('Gửi mail thất bại.');
      } else {
        return res.status(200).json({
          success: true,
          message: 'Gửi mail thành công.',
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
