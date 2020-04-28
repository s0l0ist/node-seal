#!/usr/bin/env bash

rm -rf ./src/bin/js/* ./src/bin/wasm/*  \
&& cd ./submodules/SEAL/ \
&& rm -rf ./bin/* \
&& rm -rf ./lib/*  \
&& rm -rf ./CMakeFiles \
&& rm -rf ./CMakeCache.txt \
&& cd ./native \
&& rm -rf ./src/CMakeFiles \
&& rm -rf ./src/CMakeCache.txt \
&& cd ../../../
