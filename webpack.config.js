const path = require('path')
const nodeExternals = require('webpack-node-externals')

const commonConfig = {
  mode: 'production',
  context: path.resolve(__dirname, '.'),
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /a\.out\.wasm$/,
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
    // library: 'Seal',
    libraryTarget: 'umd',
    globalObject: `(typeof self !== 'undefined' ? self : this)`,
    umdNamedDefine: true
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /a\.out\.wasm$/,
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
    // library: 'Seal',
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
