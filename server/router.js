const routes = require('./routes')
const Router = require('koa-router')

// module.exports = function (config) {
//     .get('/users', routes.users(config).fetchAll)
//     .post(routes.users.addOne)

//   // router.route('/users/:id')
//   //   .get(routes.users(config).fetchOne)

//   // router.route('/users/login')
//   //   .post(routes.users.login)

//   return router
// }

module.exports = new Router({
  prefix: '/api'
})

  .use(async (ctx, next) => {
    await next()

    ctx.set('Content-Type', 'application/json')
  })

  .get('/users', routes.users.fetchAll)
  .post('/users', routes.users.addOne)

  .get('/users/:id', routes.users.fetchOne)

  .post('/users/login', routes.users.login)
