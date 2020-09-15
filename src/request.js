/* eslint-disable no-sequences */

const HEAEDR_AUTHORIZATION = 'Authorization'
const HEADER_CONTENT_TYPE = 'Content-Type'
const CONTENT_TYPE_JSON = 'application/json'
const CONTENT_TYPE_FORM_URLENCODED =
  'application/x-www-form-urlencoded;charset=UTF-8'
const METHOD_GET = 'GET'
const METHOD_POST = 'POST'
const METHOD_PUT = 'PUT'
const METHOD_DELETE = 'DELETE'

function throwHttpError(status, reason) {
  const httpError = new Error(status)
  httpError.code = status
  httpError.reason = reason
  throw httpError
}

function handleHttpStatus(res) {
  const { status, statusText } = res
  if (status >= 200 && status < 300) return res
  throwHttpError(status, statusText)
}

export default function Request(_url, _method) {
  if (!_url) throw new TypeError('URL is required')

  const self = this
  const url = _url.startsWith('/')
    ? new URL(_url, location.origin)
    : new URL(_url)
  const method = _method || METHOD_GET
  const headers = {}
  let body
  let handleResponse = res => res

  self.header = setHeader
  self.auth = setAuthorization
  self.bearer = setBearerToken
  self.param = setParam
  self.params = setParams
  self.body = setBody
  self.jsonBody = setJsonBody
  self.formBody = setFormBody
  self.urlencodedFormBody = setUrlencodedFormBody
  self.acceptJson = setJsonResponseHandler
  self.then = startFetching

  function setHeader(name, value) {
    return value && (headers[name] = value), self
  }
  function setAuthorization(token) {
    return setHeader(HEAEDR_AUTHORIZATION, token)
  }
  function setBearerToken(token) {
    return token ? setAuthorization(`Bearer ${token}`) : self
  }
  function setParam(key, value) {
    return value && url.searchParams.set(key, value), self
  }
  function setParams(data) {
    return Object.keys(data).forEach(k => setParam(k, data[k])), self
  }
  function setBody(data) {
    return data && (body = data), self
  }
  function setJsonBody(data) {
    setHeader(HEADER_CONTENT_TYPE, CONTENT_TYPE_JSON)
    return setBody(JSON.stringify(data))
  }
  function setFormBody(data) {
    return setBody(
      Object.keys(data).reduce(
        (f, k) => (f.append(k, data[k]), f),
        new FormData()
      )
    )
  }
  function setUrlencodedFormBody(data) {
    setHeader(HEADER_CONTENT_TYPE, CONTENT_TYPE_FORM_URLENCODED)
    return setBody(
      Object.keys(data).reduce(
        (p, k) => (p.set(k, data[k]), p),
        new URLSearchParams()
      )
    )
  }
  function setJsonResponseHandler() {
    return (handleResponse = res => res.json()), self
  }
  function startFetching(onFulfill, onReject) {
    return fetch(url, { method, headers, body })
      .then(handleHttpStatus, () => throwHttpError(999, 'Network Error'))
      .then(handleResponse)
      .then(onFulfill, onReject)
  }
}

Request.get = url => new Request(url, METHOD_GET)
Request.post = url => new Request(url, METHOD_POST)
Request.put = url => new Request(url, METHOD_PUT)
Request.delete = url => new Request(url, METHOD_DELETE)
