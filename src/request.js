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
  httpError.code = status + ''
  httpError.reason = reason
  throw httpError
}

function handleHttpStatus(response) {
  const { status, statusText } = response
  if (status >= 200 && status < 300) return response
  return response.json().then(
    data => throwHttpError(status, data),
    () => throwHttpError(status, statusText)
  )
}

export default function Request(pUrl, pMethod) {
  if (!pUrl) throw new TypeError('URL is required')
  const self = this
  const url = pUrl.startsWith('/')
    ? new URL(pUrl, location.origin)
    : new URL(pUrl)
  const method = pMethod || METHOD_GET
  const headers = {}
  let body
  let handleResponse = res => res

  self.header = setHeader
  self.auth = setAuthorization
  self.jwt = setJwt
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
    if (value) headers[name] = value
    return self
  }
  function setAuthorization(token) {
    return setHeader(HEAEDR_AUTHORIZATION, token)
  }
  function setJwt(token) {
    return token ? setAuthorization('JWT ' + token) : self
  }
  function setBearerToken(token) {
    return token ? setAuthorization('Bearer ' + token) : self
  }
  function setParam(key, value) {
    if (value) url.searchParams.set(key, value)
    return self
  }
  function setParams(data) {
    if (data) Object.keys(data).forEach(key => setParam(key, data[key]))
    return self
  }
  function setBody(data) {
    if (data) body = data
    return self
  }
  function setJsonBody(data) {
    setHeader(HEADER_CONTENT_TYPE, CONTENT_TYPE_JSON)
    return setBody(JSON.stringify(data))
  }
  function setFormBody(data) {
    return setBody(
      Object.keys(data).reduce((formData, key) => {
        formData.append(key, data[key])
        return formData
      }, new FormData())
    )
  }
  function setUrlencodedFormBody(data) {
    setHeader(HEADER_CONTENT_TYPE, CONTENT_TYPE_FORM_URLENCODED)
    return setBody(
      Object.keys(data).reduce((searchParams, key) => {
        searchParams.set(key, data[key])
        return searchParams
      }, new URLSearchParams())
    )
  }
  function setJsonResponseHandler() {
    handleResponse = res => res.json()
    return self
  }
  function startFetching(onFulfill, onReject) {
    return fetch(url, {
      method,
      headers,
      body
    })
      .then(handleHttpStatus, () => throwHttpError('000', 'Network Error'))
      .then(handleResponse)
      .then(onFulfill, onReject)
  }
}

Request.get = url => new Request(url, METHOD_GET)
Request.post = url => new Request(url, METHOD_POST)
Request.put = url => new Request(url, METHOD_PUT)
Request.delete = url => new Request(url, METHOD_DELETE)
