import express from "express";
import compression from "compression";

const app = express();
app.use(express.json());
app.use(compression());
app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const db = require("./models");
db.sequelize.sync({ alter: true }).then(console.log);

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

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});
