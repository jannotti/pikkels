import gql from "graphql-tag";

const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]
    leagues: [League!]!
    league(id: ID!): League!
  }

  type User {
    id: ID!
    username: String!
    leagues: [League!]
  }

  type League {
    id: ID!
    text: String!
    user: User!
  }

  type Mutation {
    createLeague(text: String!): League!
    updateLeague(id: ID!, text: String!): League!
    deleteLeague(id: ID!): Boolean!
  }
`;

export default schema;
