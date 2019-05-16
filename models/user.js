'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
    },
    db: {
      allowNull: false,
      type: DataTypes.JSON
    }
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
