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

  type Query {
    user: UserCheckIn
  }

  type Mutation {
    signUp(name: String, password: String): UserCheckIn
    signIn(name: String, password: String): UserCheckIn
  }
`;

module.exports = typeDefs;
