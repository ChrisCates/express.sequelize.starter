//Get base server
const config = require('./config.' + process.env.NODE_ENV + '.json')
const base = require('./server.base.js')(config)
const app = base.app
const sequelize = base.deps.sequelize

const PORT = process.env.PORT || config.port

//Initialize server
sequelize.sync().then(() => {
  app.listen(PORT)
  console.log('Starter pack running on PORT', PORT)
  if (process.env.NODE_ENV == 'testing') {
    console.log('Testing mode so exiting')
    process.exit()
  }
})
