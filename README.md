# Request.js

`Request` is a tiny [fetch](https://fetch.spec.whatwg.org/) wrapper tried to make HTTP request code more readable and more easy to write.

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
npm install @shining/request --save
```
As an alternative to using npm, you can user `Request` from the CDN. You will also need [fetch polyfill](https://github.com/github/fetch) and [Promise polyfill](https://github.com/taylorhakes/promise-polyfill) for old browsers (Check out compatibility information at [caniuse/fetch](https://caniuse.com/#search=fetch) and [caniuse/Promises](https://caniuse.com/#feat=promises)).

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

MIT
