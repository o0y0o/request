import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import pkg from './package.json'

const input = './src/request.js'
const babelPlugin = babel({
  exclude: 'node_modules/**',
  externalHelpers: false
})

export default [
  {
    input,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        interop: false
      },
      {
        file: pkg.module,
        format: 'esm'
      }
    ],
    plugins: [babelPlugin]
  },
  {
    input,
    output: {
      file: pkg.browser,
      format: 'iife',
      name: 'Request'
    },
    plugins: [babelPlugin, uglify()]
  }
]
