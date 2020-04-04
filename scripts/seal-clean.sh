#!/usr/bin/env bash

rm -rf ./src/bin/* \
&& cd ./submodules/SEAL/native \
&& rm -rf ./bin/* \
&& rm -rf ./lib/*  \
&& rm -rf ./src/CMakeFiles \
&& rm -rf ./src/CMakeCache.txt \
&& cd ../../../
