const promise = require('bluebird')
const pg = require('pg-promise')

module.exports = ({ logger, environment, postgresURI }) => {
  let options = {
    promiseLib: promise
  }

  options.noWarnings = (environment === 'test')

  const pgp = pg(options)

  return pgp
}
