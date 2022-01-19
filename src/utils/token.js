const jwt = require('jsonwebtoken');

const secret = process.env.TOKEN_SECRET || '';

/**
 * Takes the body of the new token as an object
 * that has the user id as a property
 *
 * Returns the new signed jwt token
 *
 * @param {Object} body - the body of the jwt token
 * @param {string} body.id - the id of the user
 * @returns String
 */
const tokenGenerate = (body) => {
  return jwt.sign({ name: body.id }, secret, {
    expiresIn: '1d',
  });
};

/**
 * Takes a signed jwt token
 *
 * Returns true if the token is valid
 *
 * @param {string} token
 * @returns boolean
 */
const tokenValidate = (token) => {
  try {
    jwt.verify(token, secret);
  } catch (e) {
    return false;
  }
};

/**
 * Takes a signed jwt token
 *
 * Returns the user's id or null
 *
 * @param {string} token - signed jwt token
 * @returns ?string
 */
const decodeUser = (token) => {
  tokenValidate(token);
  const decoded = jwt.decode(token);
  if (typeof decoded === 'string' || decoded === null) return null;
  return decoded.id;
};

module.exports = { tokenGenerate, tokenValidate, decodeUser };
