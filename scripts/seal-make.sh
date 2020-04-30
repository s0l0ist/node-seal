#!/usr/bin/env bash

source ./submodules/emsdk/emsdk_env.sh > /dev/null
cd ./submodules/SEAL/
emmake make -j$(python -c 'import multiprocessing as mp; print(mp.cpu_count())')
cd ../../
