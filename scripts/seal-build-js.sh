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
  libseal-3.7.a \
  --bind \
  -o "${FILE_NAME}" \
  -s WASM=0 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORT_ES6=1 \
  -s MODULARIZE=1 \
  -s USE_ES6_IMPORT_META=0 \
  -s SINGLE_FILE=1 \
  -s MAXIMUM_MEMORY=4GB \
  -s ENVIRONMENT="${ENVIRONMENT}" \
  --closure 0
cp "${FILE_NAME}" ../../../../src/bin/"${FILE_NAME}"
printf "done\n"
cd ../../../
