#!/usr/bin/env bash

cd ./submodules/emsdk/
source ./emsdk_env.sh > /dev/null
cd ../SEAL/
emmake make -j$(python -c 'import multiprocessing as mp; print(mp.cpu_count())')
cd ../../
