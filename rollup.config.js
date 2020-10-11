import { terser } from 'rollup-plugin-terser'
import alias from '@rollup/plugin-alias'
import typescript from 'rollup-plugin-typescript2'
const formats = ['umd']
const targets = ['allows', 'throws']
const variants = ['wasm', 'js']
const environments = ['node', 'web', 'worker']
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
                  input: `src/${target}_${variant}_${environment}.ts`,
                  output: {
                    file: `dist/${target}_${variant}_${environment}.js`,
                    sourcemap: true,
                    format,
                    name: 'SEAL',
                    exports: 'auto',
                    plugins: [terser()]
                  },
                  plugins: [
                    alias({
                      entries: [
                        // Used to replace the paths that use `import sealLibrary from './seal_*'` statement to point to their respective JS files
                        {
                          find: /^seal_(.*)$/,
                          replacement: './src/bin/seal_$1.js'
                        }
                      ]
                    }),
                    typescript({
                      verbosity: 2
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
