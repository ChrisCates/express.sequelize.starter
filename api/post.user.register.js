module.exports = (deps) => {

  //Server dependencies
  const router = deps.router
  const sequelize = deps.sequelize
  const bcrypt = deps.bcrypt
  const async = deps.async
  const joi = deps.joi

  //Initialize route
  router.post('/user/register', (req,res) => {

    async.series(
      [
        //Validation
        (callback) => {
          joi.validate(
            {
              'email': req.body.email,
              'password': req.body.password,
              'grantType': req.body.grantType
            },
            joi.object().keys({
              'email': joi.string().min(3).max(100),
              'password': joi.string().min(5).max(100),
              'grantType': joi.string().min(4).max(10)
            }),
            (err) => {
              if (err) return callback(err)
              callback()
            }
          )
        },
        //Check if email already exists
        (callback) => {
          sequelize.User.findOne({
            'where': {
              'email': req.body.email,
              'grantType': req.body.grantType
            }
          }).then( (User) => {
            if (!User) {
              callback()
            } else {
              callback('User already exists...')
            }
          })
        },
        //Insert into database
        (callback) => {
          var password = bcrypt.hashSync(req.body.password, 10)
          sequelize.User.create({
            'email': req.body.email,
            'password': password,
            'grantType': req.body.grantType
          }).then( () => {
            callback()
          })
        }
      ],
      //Send result message if there is an error or not
      (err) => {
        if (err) {
          return res.status(500).send({
            'status': 500,
            'message': err
          })
        } else {
          return res.status(200).send({
            'status': 200,
            'message': req.body.email + ' signed up as a ' + req.body.grantType
          })
        }
      }
    )

  })

  return router
}
