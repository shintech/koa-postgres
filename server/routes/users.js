const { respond, promisify, generateWebToken } = require('../lib')
const bcrypt = require('bcryptjs')

module.exports = {
  fetchAll: async (ctx, next) => {
    const { logger, db } = ctx

    let query

    try {
      query = await promisify({ logger, query: db.any('SELECT * from users ORDER BY id DESC') })
    } catch (err) {
      query = err
    }

    ctx.status = query.status
    ctx.body = query.response
  },

  fetchOne: async (ctx, res) => {
    const { logger, db } = ctx

    const itemId = parseInt(ctx.params.id)

    let query

    try {
      query = await promisify({ logger, query: db.one('SELECT * FROM users WHERE id = $1', [itemId]) })
    } catch (err) {
      query = err
    }

    ctx.status = query.status
    ctx.body = query.response
  },

  addOne: async (ctx, res) => {
    const { logger, db, request } = ctx

    const encryptedPassword = bcrypt.hashSync(request.body.password, bcrypt.genSaltSync(10), null)

    const attrs = {
      first_name: request.body.first_name,
      last_name: request.body.last_name,
      email: request.body.email,
      username: request.body.username,
      password: encryptedPassword
    }

    let query

    try {
      query = await promisify({ logger, query: db.one('insert into users( first_name, last_name, email, username, password )' + 'values( ${first_name}, ${last_name}, ${email}, ${username}, ${password} ) returning id', attrs) }) // eslint-disable-line
    } catch (err) {
      query = err
    }

    ctx.status = query.status
    ctx.body = query.response
  },

  login: async (ctx, res) => {
    const { logger, db, request } = ctx

    let response = {
      status: 500,
      body: {}
    }

    if (!request.body.username || request.body.username === '') { return respond(res, 401, { token: false }) }

    try {
      let query = await promisify({ logger, query: db.one('SELECT id, username, password FROM users WHERE username = $1', [request.body.username]) })

      if (!query.response.error) {
        response = (bcrypt.compareSync(request.body.password, query.response.password)) ? { status: 200, body: { token: generateWebToken(query) } } : { status: 401, body: { token: false } }
      } else {
        response = { status: 401, body: { token: false } }
      }
    } catch (err) {
      logger.error(err.message)

      response = {
        status: 401,
        body: {
          token: false
        }
      }
    }

    ctx.status = response.status
    ctx.body = response.body
  }
}

/*
  password = $2a$10$oTHc103GQnIu.jvMN2XKA.o1oqv3SMK1pgm7Fl9aN96QUSVdkEe8a
*/
