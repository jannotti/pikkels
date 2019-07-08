const league = (sequelize, DataTypes) => {
  const League = sequelize.define("league", {
    text: {
      type: DataTypes.STRING,
    },
  });

  League.associate = models => {
    League.belongsTo(models.user);
  };

  return League;
};

export default league;
