"use strict";
module.exports = (sequelize, DataTypes) => {
  const League = sequelize.define("League", {
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
    },
    db: {
      allowNull: false,
      type: DataTypes.JSON,
    },
  });
  League.associate = function(models) {
    // associations can be defined here
  };
  return League;
};
