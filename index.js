const pkg = require('./package.json')
const configDB = require('./server/db')

const root = __dirname
const environment = process.env['NODE_ENV']
const port = process.env['PORT'] || 8000
const postgresURI = process.env['DATABASE_URL'] || `postgres://postgres:postgres@localhost:5432/api_${environment}`

const logger = require('shintech-logger')({ environment })
const db = configDB({ logger, environment })

if (!module.parent) require('./server')({ pkg, db, logger, environment, port, postgresURI, root })
