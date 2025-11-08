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


FILE_NAME="seal_${TYPE}"
FILE_NAME_DEFS="${FILE_NAME}.d.ts"
printf "Building: ${FILE_NAME}..."
emcc \
  -Wall \
  -flto \
  -fwasm-exceptions \
  -O3 \
  -Wl,--whole-archive libseal-4.1.a -Wl,--no-whole-archive \
  -lembind \
  -o "${FILE_NAME}.js" \
  --emit-tsd "${FILE_NAME_DEFS}" \
  -s WASM_LEGACY_EXCEPTIONS=0 \
  -s EXCEPTION_STACK_TRACES=1 \
  -s USE_CLOSURE_COMPILER=1 \
  -s SUPPORT_LONGJMP=wasm \
  -s ASSERTIONS=0 \
  -s WASM=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s DYNAMIC_EXECUTION=0 \
  -s EXPORT_ES6=1 \
  -s MODULARIZE=1 \
  -s MAXIMUM_MEMORY=4GB
cp "${FILE_NAME}.js" ../../../../src/"${FILE_NAME}.js"
cp "${FILE_NAME}.wasm" ../../../../src/"${FILE_NAME}.wasm"
cp "${FILE_NAME_DEFS}" ../../../../src/"${FILE_NAME_DEFS}"
printf "done\n"
cd ../../../
