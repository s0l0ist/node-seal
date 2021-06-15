#!/usr/bin/env bash

cd ./submodules/emsdk/
source ./emsdk_env.sh > /dev/null
EM_NODE_JS=$NODE
unset NODE

cd ../SEAL/

if [[ "$BUILD_BENCH" == "ON" ]]; then
  BENCH="ON"
  FLAGS="-DNDEBUG -flto -O3 -Wno-unused-but-set-variable"
else
  BENCH="OFF"
  FLAGS="-DNDEBUG -flto -O3"
fi

emcmake cmake -S . -B build \
  -DSEAL_USE_CXX17=ON \
  -DCMAKE_CXX_FLAGS_RELEASE="$FLAGS" \
  -DCMAKE_C_FLAGS_RELEASE="$FLAGS" \
  -DSEAL_USE_INTRIN=OFF \
  -DSEAL_USE_ZLIB=ON \
  -DSEAL_USE_MSGSL=OFF \
  -DSEAL_BUILD_BENCH=$BENCH \
  -DSEAL_BUILD_EXAMPLES=OFF \
  -DSEAL_BUILD_TESTS=OFF \
  -DBUILD_SHARED_LIBS=OFF \
  -DSEAL_THROW_ON_TRANSPARENT_CIPHERTEXT=$THROW_ON_TRANSPARENT \
  -DCMAKE_BUILD_TYPE=Release \
  .
cd ../../
