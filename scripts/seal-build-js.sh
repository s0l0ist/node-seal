#!/usr/bin/env bash

cd ./submodules/emsdk/
source ./emsdk_env.sh > /dev/null

cd ../SEAL/lib/

if [[ "$THROWS_ON_TRANSPARENT" == "ON" ]]; then
  TYPE="throws_transparent"
else
  TYPE="allows_transparent"
fi

if [[ "$ENVIRONMENT" == "node" ]]; then
  TARGET="node"
elif [[ "$ENVIRONMENT" == "web,webview" ]]; then
  TARGET="web"
elif [[ "$ENVIRONMENT" == "worker" ]]; then
  TARGET="worker"
fi

FILE_NAME="seal_${TYPE}_js_${TARGET}.js"
printf "Building: ${FILE_NAME}..."
emcc \
  -Wall \
  -flto \
  -O2 \
  libseal-3.5.a \
  --bind \
  -o "${FILE_NAME}" \
  -s WASM=0 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORT_ES6=1 \
  -s MODULARIZE=1 \
  -s USE_ES6_IMPORT_META=0 \
  -s SINGLE_FILE=1 \
  -s ENVIRONMENT="${ENVIRONMENT}" \
  --closure 0
cp "${FILE_NAME}" ../../../src/bin/$FILE_NAME.js
printf "done\n"
cd ../../
