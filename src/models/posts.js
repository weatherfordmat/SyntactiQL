'use strict';

module.exports = (sequelize, DataTypes) => {
  var Posts = sequelize.define('Posts', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subtitle: {
      type: DataTypes.STRING,
    },
    topic: {
      type: DataTypes.STRING,
    },
    article: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    published: DataTypes.BOOLEAN,
    paidContent: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        (models.Posts).hasOne((models.User), { as: 'Author-User'});
      }
    }
  });
  return Posts;
};