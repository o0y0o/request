/* global describe it */
import assert from 'assert'
import fetchMock from 'fetch-mock'
import FormData from 'form-data'
import Request from '../src/request'

const testUrl = 'https://foo.bar'

describe('Request', () => {
  global.FormData = FormData

  it('should send GET request', async () => {
    fetchMock.mock(testUrl, 200)
    const res = await Request.get(testUrl)
    assert(res.ok)
    fetchMock.restore()
  })

  it('should send POST request', async () => {
    fetchMock.mock(testUrl, 200, { method: 'POST' })
    const res = await Request.post(testUrl)
    assert(res.ok)
    fetchMock.reset()
  })

  it('should send PUT request', async () => {
    fetchMock.mock(testUrl, 200, { method: 'PUT' })
    const res = await Request.put(testUrl)
    assert(res.ok)
    fetchMock.reset()
  })

  it('should send DELETE request', async () => {
    fetchMock.mock(testUrl, 200, { method: 'DELETE' })
    const res = await Request.delete(testUrl)
    assert(res.ok)
    fetchMock.reset()
  })

  it('should send request with custom headers', async () => {
    const headers = {
      'x-custom-key1': 'value1',
      'x-custom-key2': 'value2'
    }
    fetchMock.mock(testUrl, 200, { headers })
    const res = await Request.get(testUrl)
      .header('x-custom-key1', 'value1')
      .header('x-custom-key2', 'value2')
      .header('x-custom-key3', undefined)
    assert(res.ok)
    fetchMock.reset()
  })

  it('should send request with authorization header', async () => {
    const headers = { Authorization: 'value' }
    fetchMock.mock(testUrl, 200, { headers })
    await Request.get(testUrl).auth('value')
    assert.deepStrictEqual(fetchMock.lastOptions().headers, headers)
    fetchMock.reset()
  })

  it('should send request with JWT authorization header', async () => {
    const headers = { Authorization: 'JWT tokenValue' }
    fetchMock.mock(testUrl, 200, { headers })
    await Request.get(testUrl).jwt('tokenValue')
    assert.deepStrictEqual(fetchMock.lastOptions().headers, headers)
    fetchMock.reset()
  })

  it('should send request with bearer authorization header', async () => {
    const headers = { Authorization: 'Bearer tokenValue' }
    fetchMock.mock(testUrl, 200, { headers })
    await Request.get(testUrl).bearer('tokenValue')
    assert.deepStrictEqual(fetchMock.lastOptions().headers, headers)
    fetchMock.reset()
  })

  it('should send request with URL parameter', async () => {
    fetchMock.mock('*', 200)
    await Request.get(testUrl)
      .param('foo', 'bar')
      .param('bar', null)
    assert.strictEqual(fetchMock.lastUrl(), `${testUrl}/?foo=bar`)
    fetchMock.reset()
  })

  it('should send request with URL parameters', async () => {
    fetchMock.mock('*', 200)
    await Request.get(testUrl).params({ foo: 'bar', bar: null })
    assert.strictEqual(fetchMock.lastUrl(), `${testUrl}/?foo=bar`)
    fetchMock.reset()
  })

  it('should send request with body', async () => {
    fetchMock.mock(testUrl, 200, { method: 'POST' })
    await Request.post(testUrl).body('bodyValue')
    assert.strictEqual(fetchMock.lastOptions().body, 'bodyValue')
    fetchMock.reset()
  })

  it('should send request with JSON body', async () => {
    const body = { foo: 'bar', bar: 'foo' }
    fetchMock.mock(testUrl, 200, { method: 'POST' })
    await Request.post(testUrl).jsonBody(body)
    assert.strictEqual(fetchMock.lastOptions().body, JSON.stringify(body))
    fetchMock.reset()
  })

  it('should send request with form body', async () => {
    const body = { foo: 'bar', bar: 'foo' }
    fetchMock.mock(testUrl, 200, { method: 'POST' })
    await Request.post(testUrl).formBody(body)
    assert(fetchMock.lastOptions().body instanceof FormData)
    fetchMock.reset()
  })

  it('should send request with URL-encoded form body', async () => {
    const body = { foo: 'bar', bar: 'foo' }
    fetchMock.mock(testUrl, 200, { method: 'POST' })
    await Request.post(testUrl).urlencodedFormBody(body)
    const actualBody = fetchMock.lastOptions().body
    const paramKeys = Array.from(actualBody.keys())
    assert.deepStrictEqual(
      paramKeys.reduce((obj, k) => ({ ...obj, [k]: actualBody.get(k) }), {}),
      body
    )
    fetchMock.reset()
  })

  it('should accept and parse JSON response', async () => {
    const body = { foo: 'bar', bar: 'foo' }
    fetchMock.mock(testUrl, { body })
    const response = await Request.get(testUrl).acceptJson()
    assert.deepStrictEqual(response, body)
    fetchMock.reset()
  })

  it('should handle 404 Not Found', async () => {
    fetchMock.mock(testUrl, 404)
    try {
      await Request.get(`${testUrl}`)
    } catch (error) {
      assert.strictEqual(error.code, '404')
      assert.strictEqual(error.reason, 'Not Found')
    }
    fetchMock.reset()
  })

  it('should handle internet disconnected', async () => {
    fetchMock.mock(testUrl, { throws: new Error() })
    try {
      await Request.get(`${testUrl}`)
    } catch (error) {
      assert.strictEqual(error.code, '000')
      assert.strictEqual(error.reason, 'Network Error')
    }
    fetchMock.reset()
  })
})
