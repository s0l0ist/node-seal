#!/usr/bin/env bash

cd ./submodules/zlib && \
rm -rf \
CMakeCache.txt \
CMakeFiles \
CTestTestfile.cmake \
cmake_install.cmake \
example.* \
example64.* \
minigzip* \
&& git checkout -- . && cd ../../../
