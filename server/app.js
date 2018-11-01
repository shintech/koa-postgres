module.exports = function app ({ db, logger, server, port }) {
  const app = server.listen(port)

  app.on('close', () => {
    db.end()
  })

  return app
}
