const mongoose = require('mongoose');
const User = require('../db/users');
const Tweet = require('../db/tweets');
const { gen, compare } = require('../utils/hash');
const { tokenGenerate } = require('../utils/token');

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      const { user } = context;
      // validate user
      if (!user?._id) throw new Error('User is not signed in');

      // sign jwt
      const token = tokenGenerate({ id: user?._id });

      // return { user, jwt }
      return { user, jwt: token };
    },
  },
  Mutation: {
    signUp: async (parent, args, context) => {
      const { name, password } = args;

      // verify name is not in use
      const user = await User.findOne({ name }).lean();
      if (user?._id) throw new Error('User already exists');

      // create user
      const hash = await gen(password);
      const newUser = await User.create({ name, password: hash }).then((user) => user.toObject());

      // sign jwt
      const token = tokenGenerate({ id: newUser?._id });

      // return { user, jwt }
      return { user: newUser, jwt: token };
    },
    signIn: async (parent, args, context) => {
      const { name, password } = args;

      // find user that matches provided name
      const user = await User.findOne({ name }).lean();
      if (!user?._id) throw new Error('User does not exist');

      // verify provided password matches user's hash
      const passwordIsValid = await compare(password, user?.password);
      if (!passwordIsValid) throw new Error('Password is not valid');

      // sign jwt
      const token = tokenGenerate({ id: user?._id });

      // return { user, jwt }
      return { user, jwt: token };
    },
    composeTweet: async (parent, args, context) => {
      const { user } = context;
      // validate user
      if (!user?._id) throw new Error('User is not signed in');

      // create tweet
      const { message } = args;
      const currentTime = new Date().toISOString();
      const userObjectId = mongoose.Types.ObjectId(user._id);
      const newTweet = await Tweet.create({
        message,
        date: currentTime,
        user: userObjectId,
      }).then((user) => user.toObject());

      // return tweet
      return {
        ...newTweet,
        user,
      };
    },
  },
};

module.exports = resolvers;
