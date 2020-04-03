#!/usr/bin/env bash

source ./submodules/emsdk/emsdk_env.sh && cd ./submodules/SEAL/native/lib/ && \
em++ -Wall -O3 --bind -o seal.js libseal-* ../../../zlib/libz.* \
-s WASM=1 \
-s INITIAL_MEMORY=1073741824 \
-s ALLOW_MEMORY_GROWTH=1 \
-s EXPORT_ES6=1 \
-s MODULARIZE=1 \
-s USE_ES6_IMPORT_META=0 \
-s SINGLE_FILE=1 \
--closure 1 \
--llvm-lto 1 \
&& cp seal* ../../../../src/bin/ && cd ../../../

# Pure JS build
#source ./submodules/emsdk/emsdk_env.sh && cd ./submodules/SEAL/native/lib/ && \
#em++ -Wall -O2 --bind -o seal.js libseal-* ../../../zlib/libz.* \
#-s WASM=0 \
#-s TOTAL_MEMORY=1024MB \
#-s ALLOW_MEMORY_GROWTH=0 \
#-s EXPORT_ES6=1 \
#-s MODULARIZE=1 \
#-s USE_ES6_IMPORT_META=0 \
#-s SINGLE_FILE=1 \
#--closure 0 \
#&& cp seal* ../../../../src/bin/ && cd ../../../
