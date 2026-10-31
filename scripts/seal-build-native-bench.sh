#!/usr/bin/env bash
set -euo pipefail

cd ./submodules/SEAL/

cmake -S . -B build-native \
  -DCMAKE_BUILD_TYPE=Release \
  -DSEAL_BUILD_BENCH=ON \
  -DSEAL_BUILD_TESTS=OFF \
  -DSEAL_BUILD_EXAMPLES=OFF \
  -DSEAL_USE_MSGSL=OFF \
  -DSEAL_USE_INTRIN=ON \
  -DSEAL_THROW_ON_TRANSPARENT_CIPHERTEXT="${THROW_ON_TRANSPARENT:-ON}" \
  "$@"

cmake --build build-native --config Release --target sealbench --parallel
