const path = require('path')

require('@babel/register')({
  extends: path.join(__dirname, '.babelrc'),
  ignore: [/node_modules/]
})
require('./test')
