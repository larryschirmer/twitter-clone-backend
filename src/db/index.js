const dbConnect = require('./dbConnect');
const User = require('./users/dataSource');

const dataSources = () => ({ user: User });

module.exports = { dbConnect, dataSources };
