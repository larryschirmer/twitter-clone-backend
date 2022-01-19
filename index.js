const { ApolloServer } = require('apollo-server');
const { typeDefs, resolvers, context } = require('./src/gql');
const { dbConnect, dataSources } = require('./src/db');

dbConnect();

const server = new ApolloServer({ typeDefs, resolvers, context, dataSources });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
