const Koa = require('koa')
const compress = require('koa-compress')
const bodyParser = require('koa-bodyparser')
const router = require('./router')

module.exports = ({ pkg, db, logger, port, environment, postgresURI, root }) => {
  const server = new Koa()
  const init = db(postgresURI)

  server.use(async (ctx, next) => {
    await next()

    const rt = ctx.response.get('X-Response-Time')
    const message = `${ctx.method} ${ctx.status} ${ctx.url} - ${rt}`

    switch (ctx.status) {
      case 200:
        logger.info(message)
        break

      case 500:
        logger.error(message)
        break

      default:
        logger.warn(message)
    }
  })

  server.use(async (ctx, next) => {
    const start = Date.now()

    await next()

    const ms = Date.now() - start
    ctx.set('X-Response-Time', `${ms}ms`)
  })

  server.use(bodyParser())
  server.use(compress({
    threshold: 1024
  }))

  server.use(async (ctx, next) => {
    ctx.logger = logger
    ctx.db = init

    await next()
  })

  server.use(router.routes())
  server.use(router.allowedMethods())

  server.use((ctx, next) => {
    ctx.status = 404
    ctx.body = '404 - Not found'
  })

  const app = server.listen(port)

  app.on('listening', () => {
    logger.info(`${pkg.name} - version: ${pkg.version} - listening on port ${port}...`)
  })

  app.on('close', () => {
    logger.warn('Shutting down server...')

    db.end()

    logger.info('Goodbye...')
  })

  process.on('SIGINT', () => {
    app.close()
  })

  return app
}
