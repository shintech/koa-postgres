const path = require('path')
const pkg = require('./package.json')
const configDB = require('./server/db')

global.process.env = {
  NODE_ENV: 'test'
}

const root = __dirname
const environment = 'test'
const port = 8001
const host = 'localhost'

const logger = require('shintech-logger')({ environment })
const db = configDB({ logger, environment })

const postgresURI = process.env['DATABASE_URL'] || `postgres://postgres:postgres@localhost:5432/api_${environment}`

global._server = require(path.join(__dirname, 'server'))({ pkg, db, logger, environment, port, host, postgresURI, root })

global._usersMock = [
  {
    id: 1,
    username: 'username',
    first_name: 'first_name',
    last_name: 'last_name',
    email: 'email@example.org',
    password: '$2a$10$z0yU2Lr73m/hz/FcrITgn.9s3vqpXmWJGvyfoG4wupvu03eylINQG'
  },
  {
    id: 2,
    username: 'user2',
    first_name: 'first_name',
    last_name: 'last_name',
    email: 'email2@example.org',
    password: '$2a$10$z0yU2Lr73m/hz/FcrITgn.9s3vqpXmWJGvyfoG4wupvu03eylINQG'
  }
]
