const { loginAdmin } = require('../services/auth.service');

const login = async (req, res, next) => {
  try {
    const result = await loginAdmin(req.body.email, req.body.password);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };
