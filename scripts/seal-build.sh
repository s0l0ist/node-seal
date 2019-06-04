#!/usr/bin/env bash

source ./submodules/emsdk/emsdk_env.sh && cd ./submodules/SEAL/native/lib/ && em++ -Wall -Os --bind -o seal.js libseal.so -s DISABLE_EXCEPTION_CATCHING=0 -s ALLOW_MEMORY_GROWTH=1 -s EXPORT_ES6=1 -s MODULARIZE=1 --closure 1 -s "BINARYEN_TRAP_MODE='clamp'" -s SINGLE_FILE=1 && cp seal* ../../../../src/bin/ && cd ../../../
