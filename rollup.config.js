import path from 'path'
import babel from '@rollup/plugin-babel'
import inject from '@rollup/plugin-inject'
import { terser } from 'rollup-plugin-terser'
import nodePkg from './packages/node/package.json'
import webPkg from './packages/web/package.json'

const input = require.resolve('./src/request.js')
const plugins = [babel({ exclude: 'node_modules/**', babelHelpers: 'runtime' })]

const nodeConfig = {
  input,
  plugins: [...plugins, inject({ fetch: 'node-fetch', FormData: 'form-data' })],
  external: ['form-data', 'node-fetch'],
  output: {
    file: path.join(__dirname, 'packages/node', nodePkg.main),
    format: 'cjs',
    exports: 'default',
    interop: 'default'
  }
}

const webConfig = {
  input,
  plugins,
  output: [
    {
      file: path.join(__dirname, 'packages/web', webPkg.main),
      format: 'cjs',
      exports: 'default'
    },
    {
      file: path.join(__dirname, 'packages/web', webPkg.iife),
      format: 'iife',
      name: 'Request',
      plugins: [terser()]
    }
  ]
}

export default [nodeConfig, webConfig]
