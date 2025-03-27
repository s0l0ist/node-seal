#!/usr/bin/env bash

cd ./submodules/emsdk/
source ./emsdk_env.sh > /dev/null
EM_NODE_JS=$NODE
unset NODE

cd ../SEAL/build/lib/

if [[ "$THROW_ON_TRANSPARENT" == "OFF" ]]; then
  TYPE="allows"
else
  TYPE="throws"
fi

if [[ "$ENVIRONMENT" == "node" ]]; then
  TARGET="node"
  EXPORT_ES6=0
elif [[ "$ENVIRONMENT" == "web,webview" ]]; then
  TARGET="web"
  EXPORT_ES6=1
elif [[ "$ENVIRONMENT" == "worker" ]]; then
  TARGET="worker"
  EXPORT_ES6=1
fi

FILE_NAME="seal_${TYPE}_wasm_${TARGET}.js"
printf "Building: ${FILE_NAME}..."
emcc \
  -Wall \
  -flto \
  -O3 \
  libseal-4.1.a \
  --bind \
  -o "${FILE_NAME}" \
  -s WASM=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORT_ES6=${EXPORT_ES6} \
  -s MODULARIZE=1 \
  -s SINGLE_FILE=1 \
  -s MAXIMUM_MEMORY=4GB \
  -s ENVIRONMENT="${ENVIRONMENT}" \
  --closure 1
cp "${FILE_NAME}" ../../../../src/bin/"${FILE_NAME}"
printf "done\n"
cd ../../../
