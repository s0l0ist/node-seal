/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
