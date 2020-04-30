#!/usr/bin/env bash

rm -rf ./src/bin/js/* ./src/bin/wasm/*
cd ./submodules/SEAL/
rm -rf ./bin/*
rm -rf ./lib/*
rm -rf ./CMakeFiles
rm -rf ./CMakeCache.txt
rm -rf ./native/src/CMakeFiles
rm -rf ./native/src/CMakeCache.txt
rm -rf ./thirdparty/zlib/CMakeFiles
rm -rf ./thirdparty/zlib/CMakeCache.txt
rm -rf ./thirdparty/zlib/src/CMakeFiles
rm -rf ./thirdparty/zlib/src/CMakeCache.txt
rm -rf ./thirdparty/msgsl/CMakeFiles
rm -rf ./thirdparty/msgsl/CMakeCache.txt
rm -rf ./thirdparty/msgsl/src/CMakeFiles
rm -rf ./thirdparty/msgsl/src/CMakeCache.txt
cd ../../
