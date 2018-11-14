# @shinin/request · [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/shiningjason/request/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/@shinin/request.svg)](https://www.npmjs.com/package/@shinin/request) [![Build Status](https://travis-ci.org/shiningjason/request.svg?branch=master)](https://travis-ci.org/shiningjason/request)

`@shinin/request` is a tiny [window.fetch](https://fetch.spec.whatwg.org/) wrapper tried to make HTTP request code more readable and more easy to write.

### Before

```js
fetch('/users/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
    'Authorization': 'JWT this-is-user-token'
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
  .jwt('this-is-user-token')
  .jsonBody({ email: 'foo@gmail.com', name: 'bar' })
  .then(handleResponse, handleError)
```

## Installation
```
npm install @shinin/request --save
```
```js
import Request from '@shinin/request'
```

As an alternative to using npm, you can use `@shinin/request` as a `<script>` tag from a [CDN](https://unpkg.com/@shinin/request/dist/request.min.js). You will also need [Promise polyfill](https://github.com/taylorhakes/promise-polyfill) and [fetch polyfill](https://github.com/github/fetch) for old browsers (Check out compatibility at [caniuse/fetch](https://caniuse.com/#search=fetch) and [caniuse/Promises](https://caniuse.com/#feat=promises)).

```html
<!--
Use promise-polyfill and whatwg-fetch only if you want to support old browsers.
Check out Promise and fetch compatibility at http://caniuse.com.
-->
<script src="https://unpkg.com/promise-polyfill"></script>
<script src="https://unpkg.com/whatwg-fetch"></script>
<script src="https://unpkg.com/@shinin/request/dist/request.min.js"></script>
<script>Request.get('http://...')</script>
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

// headers: { Authorization: 'JWT token' }
Request.get('/api').jwt('token')

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

## Browser Support

- Chrome
- Firefox
- Safari 6.1+
- IE 10+

## License

[MIT](https://github.com/shiningjason/request/blob/master/LICENSE)
