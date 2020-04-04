#!/usr/bin/env bash

source ./submodules/emsdk/emsdk_env.sh \
&& cd ./submodules/zlib \
&& emcmake cmake \
-DBUILD_EXAMPLES=OFF \
-DBUILD_SHARED_LIBS=OFF \
-DBUILD_STATIC_AND_SHARED=OFF \
-DSKIP_INSTALL_ALL=ON \
-DCMAKE_BUILD_TYPE=Release . \
&& cd ../../../
