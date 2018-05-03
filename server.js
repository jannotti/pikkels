const express = require('express');
const Sequelize = require('sequelize');

const app = express();

app.set('port', process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}


// These are irrelevant for sqlite
const [dbname, user, password] = ['main', 'joe', 'sup3rs3cr3t'];

const sequelize = new Sequelize(dbname, user, password, {
  dialect: 'sqlite',
  storage: 'db/usda-nnd.sqlite3', // sqlite only
  operatorsAliases: false,      // improve security
  logging: false,               // keep stdout cleaner in demo
});


// Tell Sequelize how to access the entries table.
const Entry = sequelize.define('entries', {
  carbohydrate_g: Sequelize.REAL,
  protein_g: Sequelize.REAL,
  fa_sat_g: Sequelize.REAL,
  fa_mono_g: Sequelize.REAL,
  fa_poly_g: Sequelize.REAL,
  kcal: Sequelize.REAL,
  description: Sequelize.STRING(100),
}, {
  timestamps: false,
});
Entry.removeAttribute('id');

app.get('/api/food', (req, res) => {
  const param = req.query.q;

  if (!param) {
    res.json({
      error: 'Missing required parameter `q`',
    });
    return;
  }

  Entry.findAll({
    // Sequelize will SELECT all known columns by default. This adds
    // another "column" to the result that is the sum of the various
    // fat columns.
    attributes: {
      include: [[Sequelize.literal('round(fa_sat_g+fa_mono_g+fa_poly_g, 2)'),
                 'fat_g']] },
    where: {
      description: { [Sequelize.Op.like]: `%${param}%` },
    },
    limit: 100,
  }).then(r => res.json(r));
});


app.listen(app.get('port'), () => {
  console.log(`Find the server at: http:/\/localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
