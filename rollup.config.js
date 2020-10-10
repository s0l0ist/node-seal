import { terser } from 'rollup-plugin-terser'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import globals from 'rollup-plugin-node-globals'
import builtins from 'rollup-plugin-node-builtins'
const targets = ['client', 'server', 'combined']
const variants = ['wasm', 'js']
const environments = ['node', 'web', 'worker']
const formats = ['cjs', 'iife', 'es']
const outputs = targets.reduce(
  (acc, target) => [
    ...acc,
    ...variants.reduce(
      (acc, variant) => [
        ...acc,
        ...environments.reduce(
          (acc, environment) => [
            ...acc,
            ...formats.reduce(
              (acc, format) => [
                ...acc,
                {
                  input: `private_set_intersection/javascript/tsc-out/index_${target}_${variant}_${environment}.js`,
                  onwarn(warning, warn) {
                    // suppress eval warnings from google-protobuf
                    if (warning.code === 'EVAL') return
                    warn(warning)
                  },
                  output: {
                    file: `private_set_intersection/javascript/dist/${target}/${variant}/${environment}/${format}/index.js`,
                    sourcemap: true,
                    format,
                    name: 'PSI',
                    exports: 'auto',
                    plugins: [terser()]
                  },
                  plugins: [
                    // Order of plugins matters!
                    // Depending on the format, we need to correctly transform the build for brower or nodejs
                    resolve(), // needed to include the external google-protobuf module in the bundle
                    commonjs(), // needed to convert commonjs to es6 for protobuf
                    format !== 'cjs'
                      ? globals({ global: true, buffer: true })
                      : undefined,
                    format !== 'cjs' ? builtins({ fs: true }) : undefined,
                    alias({
                      entries: [
                        // Used to replace the paths that use `import * psi from './psi_*'` statement to point to their respective JS files
                        {
                          find: /^psi_(.*)$/,
                          replacement:
                            './private_set_intersection/javascript/bin/psi_$1.js'
                        },
                        // Used to replace the `import { ServerSetup, Request, Response } from './proto/psi_pb'` statement to point to the JS file
                        {
                          find: /^\.\/proto\/psi_(.*)$/,
                          replacement:
                            './private_set_intersection/javascript/bin/psi_$1.js'
                        }
                      ]
                    })
                  ].filter(Boolean)
                }
              ],
              []
            )
          ],
          []
        )
      ],
      []
    )
  ],
  []
)

export default outputs
