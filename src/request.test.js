import assert from 'assert'
import fetchMock from 'fetch-mock'
import FormData from 'form-data'
import Request from './request'

const testUrl = 'https://foo.bar'

describe('Request', () => {
  global.FormData = FormData

  afterEach(() => fetchMock.reset())

  it('should send GET request', async () => {
    fetchMock.get(testUrl, 200)
    const res = await Request.get(testUrl)
    assert(res.ok)
  })

  it('should send POST request', async () => {
    fetchMock.post(testUrl, 200)
    const res = await Request.post(testUrl)
    assert(res.ok)
  })

  it('should send PUT request', async () => {
    fetchMock.put(testUrl, 200)
    const res = await Request.put(testUrl)
    assert(res.ok)
  })

  it('should send DELETE request', async () => {
    fetchMock.delete(testUrl, 200)
    const res = await Request.delete(testUrl)
    assert(res.ok)
  })

  it('should send request with custom headers', async () => {
    const headers = {
      'x-custom-key1': 'value1',
      'x-custom-key2': 'value2'
    }
    fetchMock.get(testUrl, 200, { headers })
    const res = await Request.get(testUrl)
      .header('x-custom-key1', 'value1')
      .header('x-custom-key2', 'value2')
      .header('x-custom-key3', undefined)
    assert(res.ok)
  })

  it('should send request with authorization header', async () => {
    const headers = { Authorization: 'value' }
    fetchMock.get(testUrl, 200, { headers })
    const res = await Request.get(testUrl).auth('value')
    assert(res.ok)
  })

  it('should send request with bearer authorization header', async () => {
    const headers = { Authorization: 'Bearer tokenValue' }
    fetchMock.get(testUrl, 200, { headers })
    const res = await Request.get(testUrl).bearer('tokenValue')
    assert(res.ok)
  })

  it('should send request with URL parameter', async () => {
    const query = { foo: 'bar' }
    fetchMock.get(testUrl, 200, { query })
    const res = await Request.get(testUrl).param('foo', 'bar')
    assert(res.ok)
  })

  it('should send request with URL parameters', async () => {
    const query = { foo: 'bar' }
    fetchMock.get(testUrl, 200, { query })
    const res = await Request.get(testUrl).params(query)
    assert(res.ok)
  })

  it('should send request with body', async () => {
    const body = 'bodyValue'
    fetchMock.post(testUrl, 200)
    const res = await Request.post(testUrl).body(body)
    const { body: actualBody } = fetchMock.lastOptions()
    assert(res.ok)
    assert.strictEqual(actualBody, body)
  })

  it('should send request with JSON body', async () => {
    const body = { foo: 'bar', bar: 'foo' }
    fetchMock.post(testUrl, 200, { body })
    const res = await Request.post(testUrl).jsonBody(body)
    assert(res.ok)
  })

  it('should send request with form body', async () => {
    const body = { foo: 'bar', bar: 'foo' }
    fetchMock.post(testUrl, 200)
    const res = await Request.post(testUrl).formBody(body)
    const { body: actualBody } = fetchMock.lastOptions()
    assert(res.ok)
    assert(actualBody instanceof FormData)
  })

  it('should send request with URL-encoded form body', async () => {
    const body = { foo: 'bar', bar: 'foo' }
    fetchMock.post(testUrl, 200)
    await Request.post(testUrl).urlencodedFormBody(body)
    const { body: actualBody } = fetchMock.lastOptions()
    assert.deepStrictEqual(Object.fromEntries(actualBody.entries()), body)
  })

  it('should accept and parse JSON response', async () => {
    const body = { foo: 'bar', bar: 'foo' }
    fetchMock.get(testUrl, { body })
    const res = await Request.get(testUrl).acceptJson()
    assert.deepStrictEqual(res, body)
  })

  it('should handle 404 Not Found', async () => {
    fetchMock.mock(testUrl, 404)
    try {
      await Request.get(`${testUrl}`)
    } catch (error) {
      assert.strictEqual(error.code, 404)
      assert.strictEqual(error.reason, 'Not Found')
    }
  })

  it('should handle internet error', async () => {
    fetchMock.mock(testUrl, { throws: new Error() })
    try {
      await Request.get(`${testUrl}`)
    } catch (error) {
      assert.strictEqual(error.code, 999)
      assert.strictEqual(error.reason, 'Network Error')
    }
  })
})
