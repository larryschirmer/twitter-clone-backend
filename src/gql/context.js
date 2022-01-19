const User = require('../db/users');
const { tokenValidate, decodeUser } = require('../utils/token');

const context = async ({ req }) => {
  const token = req.headers.authorization || '';
  const tokenIsValid = tokenValidate(token);

  if (tokenIsValid) {
    const userId = decodeUser(token);
    const user = await User.findOne({ _id: userId }).lean();
    return user?._id ? { user } : {};
  }

  return {};
};

module.exports = context;
