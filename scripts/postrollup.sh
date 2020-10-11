#!/usr/bin/env bash
set -euo pipefail

# Copy necessary files to dist directory
cp -rf package.json dist/
cp -rf README.md dist/
cp -rf LICENSE dist/
cp -rf CHANGES.md dist/

# Change directory into dist and pack to get
# shorter deep import links.
# Ex: 
# import SEAL from 'node-seal/throws/wasm/node/cjs'
cd dist/

# Pack
npm pack