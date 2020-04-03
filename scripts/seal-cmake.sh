#!/usr/bin/env bash

source ./submodules/emsdk/emsdk_env.sh && cd ./submodules/SEAL/native/src/ && \
emcmake cmake \
-DSEAL_USE_INTRIN=OFF \
-DEMSCRIPTEN_GENERATE_BITCODE_STATIC_LIBRARIES=1 \
-DSEAL_LIB_BUILD_TYPE=Static_PIC \
-DSEAL_USE_CXX17=ON \
-DCMAKE_BUILD_TYPE=Release \
-DSEAL_USE_ZLIB=ON \
-DZLIB_ROOT=../../../zlib . \
&& cd ../../../
