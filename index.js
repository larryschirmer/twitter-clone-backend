const { ApolloServer } = require('apollo-server');
const { typeDefs, resolvers, context } = require('./src/gql');
const dbConnect = require('./src/db/dbinit');

dbConnect();

const server = new ApolloServer({ typeDefs, resolvers, context });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
