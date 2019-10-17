#!/usr/bin/env bash

cd ./submodules/zlib && make -j`python -c 'import multiprocessing as mp; print(mp.cpu_count())'` && cd ../../
