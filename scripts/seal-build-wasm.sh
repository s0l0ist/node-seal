#!/usr/bin/env bash

cd ./submodules/emsdk/
source ./emsdk_env.sh > /dev/null

printf "Building WASM..."
cd ../SEAL/lib/

emcc \
  -Wall \
  -flto \
  -O3 \
  libseal-3.5.a \
  --bind \
  -o seal.js \
  -s WASM=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORT_ES6=1 \
  -s MODULARIZE=1 \
  -s USE_ES6_IMPORT_META=0 \
  -s SINGLE_FILE=1 \
  --closure 1

cp seal* ../../../src/bin/wasm
cd ../../
printf "Done!\n"
