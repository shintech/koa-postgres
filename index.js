const pkg = require('./package.json')
const configDB = require('./server/db')

const root = __dirname
const environment = process.env['NODE_ENV']
const port = process.env['PORT'] || 8000
const host = process.env['HOST'] || 'localhost'
const postgresURI = process.env['DATABASE_URL'] || `postgres://postgres:postgres@localhost:5432/api_${environment}`

const logger = require('shintech-logger')({ environment })
const db = configDB({ logger, environment })

const server = require('./server')({ pkg, db, logger, environment, port, postgresURI, root })

const app = server.listen(port, () => {
  logger.info(`${pkg.name} - version: ${pkg.version} - listening at ${host}:${port}...`)
})

app.on('close', () => {
  logger.warn('shutting down server...')

  db.end()
  logger.info('goodbye...')
})

process.on('SIGINT', () => {
  app.close()
})
