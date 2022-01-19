const connect = require('mongoose').connect;

const dbConnect = async () => {
  try {
    await connect(`${process.env.MONGO_URI}/twitter-clone`);
  } catch (e) {
    console.error(e);
  }
};

module.exports = dbConnect;
