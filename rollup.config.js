import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import pkg from './package.json'

const input = './src/request.js'
const babelPlugin = babel({ exclude: 'node_modules/**' })

export default [
  {
    input,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        interop: false
      }
    ],
    plugins: [babelPlugin]
  },
  {
    input,
    output: {
      file: pkg.main.replace('cjs', 'min'),
      format: 'iife',
      name: 'Request'
    },
    plugins: [babelPlugin, uglify()]
  }
]
