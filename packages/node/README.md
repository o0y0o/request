# @0y0/node-request · [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/o0y0o/request/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/@0y0/node-request.svg)](https://www.npmjs.com/package/@0y0/node-request)

`@0y0/node-request` is a tiny [fetch](https://fetch.spec.whatwg.org/) wrapper tried to make HTTP request code more readable and more easy to write.

### Before

```js
fetch('/users/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
    'Authorization': 'Bearer this-is-user-token'
  },
  body: JSON.stringify({
    email: 'foo@gmail.com',
    name: 'bar'
  })
}).then(handleResponse, handleError)
```

### After

```js
Request
  .post('/users/1')
  .bearer('this-is-user-token')
  .jsonBody({ email: 'foo@gmail.com', name: 'bar' })
  .then(handleResponse, handleError)
```

## Installation

```sh
npm install @0y0/node-request --save
```

```js
import Request from '@0y0/node-request'
```

## Usage

### Send a request

```js
Reqeust.get('/api')
Reqeust.post('/api')
Reqeust.put('/api')
Reqeust.delete('/api')
```

### Set HTTP header

```js
// headers: { foo: 'bar' }
Request.get('/api').header('foo', 'bar')

// headers: { Authorization: 'bar' }
Request.get('/api').auth('bar')

// headers: { Authorization: 'Bearer token' }
Request.get('/api').bearer('token')

// headers: { foo1: 'bar1', Authorization: 'token' }
Request.get('/api')
  .header('foo1', 'bar1')
  .header('foo2', undefined)
  .auth('token')
```

### Set URL parameters

```js
// url: /api/?foo=bar
Request.get('/api').param('foo', 'bar')

// url: /api/?foo2=bar2
Request.get('/api').param('foo1', undefined).param('foo2', 'bar2')

// url: /api/?foo1=bar1&foo2=bar2
Request.get('/api').params({ foo1: 'bar1', foo2: 'bar2' })
```

### Set request body

```js
Request.post('/api').body('content')

// Content-Type: application/json
Request.post('/api').jsonBody({ foo: 'bar' })

// Content-Type: multipart/form-data
Request.post('/api').formBody({ foo: 'bar' })

// Content-Type: application/x-www-form-urlencoded;charset=UTF-8
Request.post('/api').urlencodedFormBody({ foo: 'bar' })
```

### Handle JSON response

```js
Request.get('/api').acceptJson()
```

## License

[MIT](https://github.com/o0y0o/request/blob/master/LICENSE)
