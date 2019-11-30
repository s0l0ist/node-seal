#!/usr/bin/env bash

source ./submodules/emsdk/emsdk_env.sh && cd ./submodules/zlib && emcmake cmake -DCMAKE_BUILD_TYPE=Release . && cd ../../../
