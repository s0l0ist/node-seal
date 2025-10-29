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
  SINGLE_FILE=1
  DYNAMIC_EXECUTION=1
elif [[ "$ENVIRONMENT" == "web,webview" ]]; then
  TARGET="web"
  EXPORT_ES6=1
  SINGLE_FILE=1
  DYNAMIC_EXECUTION=1
  elif [[ "$ENVIRONMENT" == "cf_worker" ]]; then
  ENVIRONMENT="web,worker"
  TARGET="cf_worker"
  EXPORT_ES6=1
  SINGLE_FILE=0 # disabled since we cannot eval the base64 wasm
  DYNAMIC_EXECUTION=0 # do not emit eval() and new Function()
elif [[ "$ENVIRONMENT" == "web,worker" ]]; then
  TARGET="worker"
  EXPORT_ES6=1
  SINGLE_FILE=1
  DYNAMIC_EXECUTION=1
fi

FILE_NAME="seal_${TYPE}_wasm_${TARGET}.js"
printf "Building: ${FILE_NAME}..."
emcc \
  -Wall \
  -flto \
  -O3 \
  -Wl,--whole-archive libseal-4.1.a -Wl,--no-whole-archive \
  -lembind \
  -o "${FILE_NAME}" \
  -s WASM=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s DYNAMIC_EXECUTION=${DYNAMIC_EXECUTION} \
  -s EXPORT_ES6=${EXPORT_ES6} \
  -s MODULARIZE=1 \
  -s SINGLE_FILE=${SINGLE_FILE} \
  -s MAXIMUM_MEMORY=4GB \
  -s ENVIRONMENT="${ENVIRONMENT}" \
  --closure 1
cp "${FILE_NAME}" ../../../../src/bin/"${FILE_NAME}"
printf "done\n"
cd ../../../
