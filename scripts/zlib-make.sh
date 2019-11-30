#!/usr/bin/env bash

cd ./submodules/zlib && emmake make -j`python -c 'import multiprocessing as mp; print(mp.cpu_count())'` && cd ../../../
