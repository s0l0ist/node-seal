#!/usr/bin/env bash

source ./submodules/emsdk/emsdk_env.sh && cd ./submodules/SEAL/native/src/ && emcmake cmake -DSEAL_LIB_BUILD_TYPE=Shared -DSEAL_USE_CXX17=ON -DCMAKE_BUILD_TYPE=Release . && cd ../../../
