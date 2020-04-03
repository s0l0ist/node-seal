const path = require('path')
const nodeExternals = require('webpack-node-externals')

const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development'

const commonConfig = {
  mode: mode,
  context: path.resolve(__dirname, '.'),
  devtool: mode === 'development' ? 'source-map' : 'nosources-source-map',
  optimization: {
    ...(mode === 'development' ? { minimize: false } : { minimize: true })
  },
  devServer: {
    compress: false,
    publicPath: '/dist/',
    port: 9000,
    watchContentBase: true,
    open: true
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
          publicPath: 'dist/'
        }
      }
    ]
  }
}

const nodeConfig = {
  ...commonConfig,
  entry: {
    seal: './src/main.js'
  },
  output: {
    filename: '[name].node.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    globalObject: `(typeof self !== 'undefined' ? self : this)`,
    umdNamedDefine: true
  },
  target: 'node',
  externals: [nodeExternals()]
}

const browserConfig = {
  ...commonConfig,
  entry: {
    seal: './src/main.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    globalObject: `(typeof self !== 'undefined' ? self : this)`, // 'global' for RN
    umdNamedDefine: true
  },
  target: 'web',
  node: {
    fs: 'empty'
  }
}

module.exports = [nodeConfig, browserConfig]
