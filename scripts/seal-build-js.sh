#!/usr/bin/env bash

# Pure JS build
source ./submodules/emsdk/emsdk_env.sh \
&& cd ./submodules/SEAL/native/lib/ \
&& em++ \
-Wall \
-O2 \
--bind \
-o seal.js \
libseal-* ../../../zlib/libz.* \
-s WASM=0 \
-s INITIAL_MEMORY=268435456 \
-s ALLOW_MEMORY_GROWTH=1 \
-s EXPORT_ES6=1 \
-s MODULARIZE=1 \
-s USE_ES6_IMPORT_META=0 \
-s SINGLE_FILE=1 \
--closure 0 \
&& cp seal* ../../../../src/bin/js \
&& cd ../../../
