module.exports = (config) => {
  //API Dependencies
  const express = require('express')
  const app = express()
  const multer = require('multer')
  const bcrypt = require('bcryptjs')
  const async = require('async')
  const joi = require('joi')

  //Sequelize
  const Sequelize = require('sequelize')
  const sequelize = new Sequelize(
    config.mysql.database, config.mysql.user, config.mysql.password,
    {
      'host': config.mysql.host,
      'dialect': 'mysql',
      'logging': false
    }
  )

  //Redis Token && Redis Auth
  const redis = require('redis.token')(config.redis, (err) => { if (err) throw err })
  const auth = require('redis.auth')(redis)

  //Setup body parser
  const bodyParser = require('body-parser')
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({'extended': true}))

  /*********************
  **** MYSQL Schema ****
  *********************/
  sequelize.User = require('./schema/schema.user.js')(sequelize, Sequelize)

  //Create dependency object for routes
  const deps = {
    'router': express.Router(),
    'multer': multer,
    'sequelize': sequelize,
    'redis': redis,
    'auth': auth,
    'bcrypt': bcrypt,
    'async': async,
    'joi': joi
  }

  /*********************
  ***** API Routes *****
  *********************/
  //User routes
  app.use(require('./api/post.user.register.js')(deps))
  app.use(require('./api/post.user.login.js')(deps))

  //Return the application content
  return {
    'app': app,
    'deps': deps
  }
}
