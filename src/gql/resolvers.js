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
    tweets: async (parent, args, context) => {
      // get all the tweets
      const tweets = Tweet.find()
        .sort({ date: -1 })
        .populate({ path: 'user', model: 'User' })
        .populate({
          path: 'retweet',
          populate: { path: 'user', model: 'User' },
        })
        .populate({
          path: 'comments',
          populate: { path: 'user', model: 'User' },
        })
        .lean();

      // return all the tweets
      return tweets;
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
      const { message } = args;

      // validate user
      if (!user?._id) throw new Error('User is not signed in');

      // create tweet
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
    commentTweet: async (parent, args, context) => {
      const { user } = context;
      const { tweetId, message } = args;

      // validate user
      if (!user?._id) throw new Error('User is not signed in');

      // verify tweet exists
      const tweet = await Tweet.findById(tweetId);
      if (!tweet?._id) throw new Error('Tweet does not exist');

      // comment
      const currentTime = new Date().toISOString();
      const userObjectId = mongoose.Types.ObjectId(user._id);
      const newComment = {
        message,
        date: currentTime,
        user: userObjectId,
      };
      const updatedTweet = await Tweet.findOneAndUpdate(
        { _id: tweetId },
        { $push: { comments: newComment } },
        {
          new: true,
        },
      )
        .populate({ path: 'user', model: 'User' })
        .populate({
          path: 'retweet',
          populate: { path: 'user', model: 'User' },
        })
        .populate({
          path: 'comments',
          populate: { path: 'user', model: 'User' },
        })
        .lean();

      // return updated tweet
      return updatedTweet;
    },
    reTweet: async (parent, args, context) => {
      const { user } = context;
      const { tweetId } = args;

      // validate user
      if (!user?._id) throw new Error('User is not signed in');

      // verify tweet exists
      const tweet = await Tweet.findById(tweetId).populate({ path: 'user', model: 'User' });
      if (!tweet?._id) throw new Error('Tweet does not exist');

      // verify tweet has message
      if (!tweet.message || tweet.retweet) throw new Error('Tweet must be original');

      // create tweet
      const currentTime = new Date().toISOString();
      const tweetObjectId = mongoose.Types.ObjectId(tweetId);
      const userObjectId = mongoose.Types.ObjectId(user._id);
      const newTweet = await Tweet.create({
        retweet: tweetObjectId,
        date: currentTime,
        user: userObjectId,
      }).then((user) => user.toObject());

      // return tweet
      return {
        ...newTweet,
        retweet: tweet,
        user,
      };
    },
  },
};

module.exports = resolvers;
