#!/usr/bin/env bash

cd ./submodules/emsdk/
source ./emsdk_env.sh > /dev/null

printf "Building Pure JS..."
cd ../SEAL/lib/

emcc \
  -Wall \
  -flto \
  -O2 \
  libseal-3.5.a \
  --bind \
  -o seal.js \
  -s WASM=0 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORT_ES6=1 \
  -s MODULARIZE=1 \
  -s USE_ES6_IMPORT_META=0 \
  -s SINGLE_FILE=1 \
  --closure 0

cp seal* ../../../src/bin/js
cd ../../
printf "Done!\n"
