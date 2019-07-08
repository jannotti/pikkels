import express from "express";
import compression from "compression";
import { ApolloServer } from "apollo-server-express";

import schema from "./schemas";
import resolvers, { users } from "./resolvers";
import models from "./models";

const app = express();
app.use(express.json());
app.use(compression());
app.set("port", process.env.PORT || 3001);

// Serve the static build product. Only matters in production
// A REAL production would probably serve from nginx or some such.
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const apollo = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models,
    me: users[1],
  },
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
  models.User.findbyPk(id).then(user => res.json(user));
});

app.post("/api/user", (req, res) => {
  const id = req.query.id;

  if (!id) {
    res.json({
      error: "Missing required parameter `id`",
    });
    return;
  }

  models.User.upsert({ id: id, models: req.body }).then(created => res.json(created));
});

models.sequelize.sync({ alter: true }).then(() => {
  app.listen(app.get("port"), () => {
    console.log(`Apollo at: http://localhost:${app.get("port")}/graphql`);
  });
});
