#!/usr/bin/env bash

cd ./submodules/emsdk/
source ./emsdk_env.sh > /dev/null
EM_NODE_JS=$NODE
unset NODE

cd ../SEAL/

# Run CMake's generated JavaScript probes as CommonJS, despite the root package's module type.
mkdir -p build
printf '%s\n' '{"type":"commonjs"}' > build/package.json

if [[ "$BUILD_BENCH" == "ON" ]]; then
  BENCH="ON"
else
  BENCH="OFF"
fi

FLAGS="-DNDEBUG -O3 -flto -fwasm-exceptions"

emcmake cmake -S . -B build \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_CXX_FLAGS_RELEASE="$FLAGS" \
  -DCMAKE_C_FLAGS_RELEASE="$FLAGS" \
  -DSEAL_USE_INTRIN=ON \
  -DSEAL_USE_MSGSL=OFF \
  -DSEAL_BUILD_BENCH=$BENCH \
  -DSEAL_THROW_ON_TRANSPARENT_CIPHERTEXT=$THROW_ON_TRANSPARENT

cd ../../
