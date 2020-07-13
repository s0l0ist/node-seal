const path = require('path')
const nodeExternals = require('webpack-node-externals')

const mode = process.env.NODE_ENV // 'production' or 'development'
const target = process.env.TARGET // 'wasm' or 'js'
const environment = process.env.ENVIRONMENT // 'node' or 'web'
const throwOnTrans = process.env.THROW_ON_TRANSPARENT // 'ON' or 'OFF'
const transparent = (throwOnTrans === 'ON') ? 'throws_transparent' : 'allows_transparent'

const commonConfig = {
  mode: mode,
  entry: {
    seal: `./src/target/${target}/index.js`
  },
  context: path.resolve(__dirname, '.'),
  devtool: mode !== 'production' ? 'source-map' : 'nosources-source-map',
  optimization: {
    ...(mode !== 'production' ? { minimize: false } : { minimize: true })
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist', `${transparent}`, `${environment}`, `${target}`),
    libraryTarget: 'umd',
    globalObject: `(typeof self !== 'undefined' ? self : this)`, // 'global` for RN
    umdNamedDefine: true
  },
  devServer: {
    filename: 'index.js',
    index: `./dev/${target}.html`,
    compress: true,
    publicPath: `/dist/${transparent}/${environment}/${target}/`,
    port: 9000,
    watchContentBase: true,
    open: true,
    openPage: `dev/${target}.html`
  },
  module: {
    rules: [
      // Emscripten JS files define a global. With `exports-loader` we can
      // load these files correctly (provided the global’s name is the same
      // as the file name).
      {
        test: /\.js$/,
        loader: 'exports-loader'
      },
      {
        test: /\.wasm$/,
        type: 'javascript/auto',
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: `/dist/${transparent}/${environment}/${target}/`
        }
      }
    ]
  }
}

const config = {
  ...commonConfig,
  target: `${environment}`,
  ...(environment === 'node' && {
    externals: [nodeExternals()]
  }),
  ...(environment === 'web' && {
    node: {
      fs: 'empty'
    }
  })
}

module.exports = [config]
