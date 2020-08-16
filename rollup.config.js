import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const input = require.resolve('./src/request.js')
const babelConfig = { exclude: 'node_modules/**', babelHelpers: 'runtime' }

const pkgConfig = {
  input,
  plugins: [babel(babelConfig)],
  output: { file: pkg.main, format: 'cjs', exports: 'default' }
}

const browserConfig = {
  input,
  plugins: [babel(babelConfig), terser()],
  output: { file: pkg.browser, format: 'iife', name: 'Request' }
}

export default [pkgConfig, browserConfig]
