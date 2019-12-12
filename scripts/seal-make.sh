#!/usr/bin/env bash

source ./submodules/emsdk/emsdk_env.sh && cd ./submodules/SEAL/native/src/ && emmake make -j$(python -c 'import multiprocessing as mp; print(mp.cpu_count())') && cd ../../../
