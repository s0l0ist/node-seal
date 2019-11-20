#!/usr/bin/env bash

# Ensure we are building with no exception handling. This reduces size by ~30%.
source ./submodules/emsdk/emsdk_env.sh && cd ./submodules/SEAL/native/lib/ && em++ -Wall -Os --bind -o seal.js libseal* -s DISABLE_EXCEPTION_CATCHING=1 -s NODEJS_CATCH_EXIT=0 -s ALLOW_MEMORY_GROWTH=1 -s EXPORT_ES6=1 -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 --closure 1 -s "BINARYEN_TRAP_MODE='clamp'" -s SINGLE_FILE=1 && cp seal* ../../../../src/bin/ && cd ../../../

# Build with exception handling. Size of WebAssembly is larger.
#source ./submodules/emsdk/emsdk_env.sh && cd ./submodules/SEAL/native/lib/ && em++ -Wall -Os --bind -o seal.js libseal.so -s DISABLE_EXCEPTION_CATCHING=0 -s NODEJS_CATCH_EXIT=1 -s ALLOW_MEMORY_GROWTH=1 -s EXPORT_ES6=1 -s MODULARIZE=1 --closure 1 -s "BINARYEN_TRAP_MODE='clamp'" -s SINGLE_FILE=1 && cp seal* ../../../../src/bin/ && cd ../../../
