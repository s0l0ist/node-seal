#!/usr/bin/env bash

cd ./submodules/emsdk/
source ./emsdk_env.sh > /dev/null
cd ../SEAL/
emmake make -C build -j
cd ../../
