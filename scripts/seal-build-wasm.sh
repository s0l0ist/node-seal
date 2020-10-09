#!/usr/bin/env bash

cd ./submodules/emsdk/
source ./emsdk_env.sh > /dev/null

printf "Building WASM\n"
cd ../SEAL/lib/

printf "Building: seal_wasm_node..."
emcc \
  -Wall \
  -flto \
  -O3 \
  libseal-3.5.a \
  --bind \
  -o seal_wasm_node.js \
  -s WASM=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORT_ES6=1 \
  -s MODULARIZE=1 \
  -s USE_ES6_IMPORT_META=0 \
  -s SINGLE_FILE=1 \
  -s ENVIRONMENT="node" \
  --closure 1
cp seal_wasm_node.js ../../../src/bin/seal_wasm_node.js
printf "done\n"

printf "Building: seal_wasm_worker..."
emcc \
  -Wall \
  -flto \
  -O3 \
  libseal-3.5.a \
  --bind \
  -o seal_wasm_worker.js \
  -s WASM=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORT_ES6=1 \
  -s MODULARIZE=1 \
  -s USE_ES6_IMPORT_META=0 \
  -s SINGLE_FILE=1 \
  -s ENVIRONMENT="worker" \
  --closure 1
cp seal_wasm_worker.js ../../../src/bin/seal_wasm_worker.js
printf "done\n"

printf "Building: seal_wasm_web..."
emcc \
  -Wall \
  -flto \
  -O3 \
  libseal-3.5.a \
  --bind \
  -o seal_wasm_web.js \
  -s WASM=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORT_ES6=1 \
  -s MODULARIZE=1 \
  -s USE_ES6_IMPORT_META=0 \
  -s SINGLE_FILE=1 \
  -s ENVIRONMENT="web,webview" \
  --closure 1
printf "done\n"

cp seal_wasm_web.js ../../../src/bin/seal_wasm_web.js
cd ../../
