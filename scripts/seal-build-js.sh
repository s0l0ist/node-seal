#!/usr/bin/env bash

cd ./submodules/emsdk/
source ./emsdk_env.sh > /dev/null

printf "Building ASMJS\n"
cd ../SEAL/lib/

printf "Building: seal_js_node..."
emcc \
  -Wall \
  -flto \
  -O2 \
  libseal-3.5.a \
  --bind \
  -o seal_js_node.js \
  -s WASM=0 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORT_ES6=1 \
  -s MODULARIZE=1 \
  -s USE_ES6_IMPORT_META=0 \
  -s SINGLE_FILE=1 \
  -s ENVIRONMENT="node" \
  --closure 0
cp seal_js_node.js ../../../src/bin/seal_js_node.js
printf "done\n"

printf "Building: seal_js_worker..."
emcc \
  -Wall \
  -flto \
  -O2 \
  libseal-3.5.a \
  --bind \
  -o seal_js_worker.js \
  -s WASM=0 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORT_ES6=1 \
  -s MODULARIZE=1 \
  -s USE_ES6_IMPORT_META=0 \
  -s SINGLE_FILE=1 \
  -s ENVIRONMENT="worker" \
  --closure 0
cp seal_js_worker.js ../../../src/bin/seal_js_worker.js
printf "done\n"

printf "Building: seal_js_web..."
emcc \
  -Wall \
  -flto \
  -O2 \
  libseal-3.5.a \
  --bind \
  -o seal_js_web.js \
  -s WASM=0 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORT_ES6=1 \
  -s MODULARIZE=1 \
  -s USE_ES6_IMPORT_META=0 \
  -s SINGLE_FILE=1 \
  -s ENVIRONMENT="web,webview" \
  --closure 0
cp seal_js_web.js ../../../src/bin/seal_js_web.js
printf "done\n"

cd ../../
