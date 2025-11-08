#!/usr/bin/env bash

cd ./submodules/emsdk/
source ./emsdk_env.sh > /dev/null
EM_NODE_JS=$NODE
unset NODE

cd ../SEAL/

if [[ "$BUILD_BENCH" == "ON" ]]; then
  BENCH="ON"
  FLAGS="-DNDEBUG -flto -fwasm-exceptions -O3 -Wno-unused-but-set-variable"
else
  BENCH="OFF"
  FLAGS="-DNDEBUG -flto -fwasm-exceptions -O3"
fi

emcmake cmake -S . -B build \
  -DCMAKE_CXX_FLAGS_RELEASE="$FLAGS" \
  -DCMAKE_C_FLAGS_RELEASE="$FLAGS" \
  -DSEAL_USE_INTRIN=OFF \
  -DSEAL_USE_MSGSL=OFF \
  -DSEAL_BUILD_BENCH=$BENCH \
  -DSEAL_THROW_ON_TRANSPARENT_CIPHERTEXT=$THROW_ON_TRANSPARENT

cd ../../
