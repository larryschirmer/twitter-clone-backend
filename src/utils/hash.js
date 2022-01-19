const bcrypt = require('bcrypt');

/**
 * Takes string
 *
 * Returns hashed string
 *
 * @param {string} password
 * @returns string
 */
const gen = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Takes raw string and hash and compares them
 *
 * returns true if both strings match
 *
 * @param {string} password
 * @param {string} hash
 * @returns boolean
 */
const compare = async (password, hash) => {
  const result = await bcrypt.compare(password, hash);
  return result;
};

module.exports = { gen, compare };
