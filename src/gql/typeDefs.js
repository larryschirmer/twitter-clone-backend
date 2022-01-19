const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    _id: ID!
    name: String
  }

  type UserCheckIn {
    user: User
    jwt: String
  }

  type Tweet {
    message: String
    date: String
    user: User
  }

  type Query {
    user: UserCheckIn
  }

  type Mutation {
    signUp(name: String, password: String): UserCheckIn
    signIn(name: String, password: String): UserCheckIn
    composeTweet(message: String): Tweet
  }
`;

module.exports = typeDefs;
