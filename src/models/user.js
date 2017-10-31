// Example;

'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: DataTypes.STRING,
    location: DataTypes.STRING,
    birthday: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        models.User.hasMany(models.Posts);
        models.User.hasMany(models.Animal);
      }
    }
  });
  return User;
};