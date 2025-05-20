import copy from 'rollup-plugin-copy'
import terser from '@rollup/plugin-terser'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from 'rollup-plugin-typescript2'
const formats = ['umd', 'es']
const targets = ['allows', 'throws']
const variants = ['wasm']
const environments = ['node', 'web', 'worker', "cf_worker"]
const outputs = formats.reduce(
  (acc, format) => [
    ...acc,
    ...targets.reduce(
      (acc, target) => [
        ...acc,
        ...variants.reduce(
          (acc, variant) => [
            ...acc,
            ...environments.reduce(
              (acc, environment) => [
                ...acc,
                {
                  input: `src/${target}_${variant}_${environment}_${format}.ts`,
                  output: {
                    file: `dist/${target}_${variant}_${environment}_${format}.js`,
                    sourcemap: true,
                    format,
                    name: 'SEAL',
                    exports: 'auto',
                    plugins: [terser()]
                  },
                  plugins: [
                    environment === 'node' && commonjs(), // needed to convert commonjs to es6 for emscripten 'node' builds
                    alias({
                      entries: [
                        // Used to replace the paths that use `import sealLibrary from './seal_*'` statement to point to their respective JS files
                        {
                          find: /^seal_(.*)$/,
                          replacement: './src/bin/seal_$1.js'
                        },
                        {
                          find: /^(.*)\.json$/,
                          replacement: './$1.json'
                        }
                      ]
                    }),
                    json({ compact: true }),
                    typescript({
                      verbosity: 2
                    }),
                    environment === 'cf_worker' && copy({
                        targets: [
                          { src: 'submodules/SEAL/build/lib/seal_throws_wasm_cf_worker.wasm', dest: 'dist/' },
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
