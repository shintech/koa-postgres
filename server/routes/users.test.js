/* eslint-env jest */

var request = require('supertest').agent(_server)

console.log = jest.fn()

afterAll(async () => {
  await _server.close()
})

describe('SERVER -> GET /api/users -> api.fetchAll()..', () => {
  let res

  beforeAll(async () => {
    res = await request.get('/api/users')
  })

  it('expect users.length to be greater than 0...', () => {
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('expect users[0] to have property id...', () => {
    expect(res.body[0]).toHaveProperty('id')
  })

  it('expect users[0].id to equal mock.id...', () => {
    expect(res.body[0].id).toEqual(_usersMock[0].id)
  })
})

describe('SERVER -> GET /api/users/:id -> api.fetchOne()..', () => {
  let res

  beforeAll(async () => {
    res = await request.get(`/api/users/${_usersMock[0].id}`)
  })

  it('expect users[0] to have property id...', () => {
    expect(res.body).toHaveProperty('id')
  })

  it('expect users[0].id to equal mock.id...', () => {
    expect(res.body.id).toEqual(_usersMock[0].id)
  })
})
