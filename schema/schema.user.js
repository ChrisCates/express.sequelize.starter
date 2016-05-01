module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    'id': {
      'type': DataTypes.UUID,
      'defaultValue': DataTypes.UUIDV1,
      'primaryKey': true
    },
    'email': {
      'type': DataTypes.STRING
    },
    'password': {
      'type': DataTypes.STRING
    },
    'grantType': {
      'type': DataTypes.STRING
    }
  })

  return User
}
