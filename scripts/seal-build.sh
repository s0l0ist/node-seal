#!/usr/bin/env bash

source ./submodules/emsdk/emsdk_env.sh && cd ./submodules/SEAL/native/lib/ && em++ -Wall -O3 --bind -o seal.js libseal-* -s ALLOW_MEMORY_GROWTH=1 -s EXPORT_ES6=1 -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 --closure 1 -s SINGLE_FILE=1 && cp seal* ../../../../src/bin/ && cd ../../../
