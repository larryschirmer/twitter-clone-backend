const { MongoDataSource } = require('apollo-datasource-mongodb');
const UserModel = require('./index');

class User extends MongoDataSource {
  findUser(userId) {
    return this.findOneById(userId);
  }
}

module.exports = new User(UserModel);
