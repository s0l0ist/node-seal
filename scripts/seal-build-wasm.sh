#!/usr/bin/env bash

# WASM build
source ./submodules/emsdk/emsdk_env.sh \
&& cd ./submodules/SEAL/native/lib/ \
&& em++ \
-Wall \
-O3 \
--bind \
-o seal.js \
libseal-* ../../../zlib/libz.* \
-s WASM=1 \
-s ALLOW_MEMORY_GROWTH=1 \
-s EXPORT_ES6=1 \
-s MODULARIZE=1 \
-s USE_ES6_IMPORT_META=0 \
-s SINGLE_FILE=1 \
--closure 1 \
&& cp seal* ../../../../src/bin/wasm \
&& cd ../../../
