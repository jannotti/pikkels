import express from "express";
import compression from "compression";
import { ApolloServer, gql } from "apollo-server-express";

const app = express();
app.use(express.json());
app.use(compression());
app.set("port", process.env.PORT || 3001);

// Serve the static build product. Only matters in production
// A REAL production would probably serve from nginx or some such.
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]
  }

  type User {
    id: ID!
    username: String!
  }
`;

const users = {
  1: {
    id: "1",
    username: "John Jannotti",
  },
  2: {
    id: "2",
    username: "Genevieve Patterson",
  },
};

const me = users["1"];

const resolvers = {
  Query: {
    me: () => {
      return me;
    },
    user: (parent, { id }) => {
      return users[id];
    },
    users: () => {
      return Object.values(users);
    },
  },
};

const apollo = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

apollo.applyMiddleware({ app, path: "/graphql" });

app.get("/api/user", (req, res) => {
  const id = req.query.id;

  if (!id) {
    res.json({
      error: "Missing required parameter `id`",
    });
    return;
  }
  db.User.findByPk(id).then(user => res.json(user));
});

app.post("/api/user", (req, res) => {
  const id = req.query.id;

  if (!id) {
    res.json({
      error: "Missing required parameter `id`",
    });
    return;
  }

  db.User.upsert({ id: id, db: req.body }).then(created => res.json(created));
});

import db from "./models";
db.sequelize.sync({ alter: true }).then(() => {
  app.listen(app.get("port"), () => {
    console.log(`Apollo at: http://localhost:${app.get("port")}/graphql`);
  });
});
