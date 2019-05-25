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

const serverConfig = {
  mode: 'production',
  context: path.resolve(__dirname, '.'),
  entry: './main.js',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.node.js',
    // library: 'HCrypt',
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
          publicPath: 'dist/'
        }
      }
    ]
  }
}

const clientConfig = {
  mode: 'production',
  context: path.resolve(__dirname, '.'),
  entry: './main.js',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    // library: 'HCrypt',
    libraryTarget: 'umd',
    globalObject: `(typeof self !== 'undefined' ? self : this)`,
    umdNamedDefine: true
  },
  target: 'web',
  node: {
    __dirname: false,
    fs: 'empty',
    Buffer: false,
    process: false
  },
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

module.exports = [ serverConfig, clientConfig ]
