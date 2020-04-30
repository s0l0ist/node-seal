#!/usr/bin/env bash

source ./submodules/emsdk/emsdk_env.sh > /dev/null
cd ./submodules/SEAL/
emcmake cmake \
  -DSEAL_USE_CXX17=ON \
  -DCMAKE_CXX_FLAGS="-std=c++17 -fomit-frame-pointer" \
  -DCMAKE_CXX_FLAGS_RELEASE="-O3 -DNDEBUG" \
  -DCMAKE_MODULE_LINKER_FLAGS_RELEASE="-O3" \
  -DCMAKE_C_FLAGS_RELEASE="-DNDEBUG -O3" \
  -DCMAKE_EXE_LINKER_FLAGS_RELEASE="-O3" \
  -DSEAL_USE_INTRIN=OFF \
  -DSEAL_USE_ZLIB=ON \
  -DSEAL_USE_MSGSL=ON \
  -DSEAL_BUILD_EXAMPLES=OFF \
  -DSEAL_BUILD_TESTS=OFF \
  -DBUILD_SHARED_LIBS=OFF \
  -DCMAKE_BUILD_TYPE=Release \
  .
cd ../../
