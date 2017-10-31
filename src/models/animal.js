// Example;

'use strict';
module.exports = (sequelize, DataTypes) => {
  var Animal = sequelize.define('Animal', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING,
    },
    color: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        (models.Animal).hasOne((models.User), { as: 'Owner-User'});
      }
    }
  });
  return Animal;
};
