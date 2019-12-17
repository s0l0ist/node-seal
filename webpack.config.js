const path = require('path')
const nodeExternals = require('webpack-node-externals')

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'

const commonConfig = {
  mode: mode,
  context: path.resolve(__dirname, '.'),
  devtool: mode === 'development' ? 'source-map' : 'nosources-source-map',
  devServer: {
    compress: false,
    publicPath: '/dist/',
    port: 9000,
    watchContentBase: true,
    open: true,
  },
  module: {
    rules: [
      {
        test: /seal\.wasm$/,
        type: 'javascript/auto',
        loader: 'file-loader',
        options: {
          publicPath: 'dist/'
        }
      }
    ]
  }
}

const serverConfig = {...commonConfig,
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
  module: {
    rules: [
      {
        test: /seal\.wasm$/,
        type: 'javascript/auto',
        loader: 'file-loader',
        options: {
          publicPath: 'node_modules/node-seal/dist/'
        }
      }
    ]
  },
  externals: [nodeExternals()],
}

const clientConfig = {...commonConfig,
  entry: {
    seal: './src/main.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    globalObject: `(typeof self !== 'undefined' ? self : this)`,
    umdNamedDefine: true
  },
  target: 'web',
  node: {
    fs: 'empty',
  },
}


module.exports = [ serverConfig, clientConfig ]
