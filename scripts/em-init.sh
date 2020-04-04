#!/usr/bin/env bash

# Sets up llvm instead of fastcomp.
cd submodules/emsdk/ \
&& ./emsdk install latest \
&& ./emsdk activate latest \
&& cd ../../

# Sets up fastcomp (previous backend)
#cd submodules/emsdk/ \
#&& ./emsdk install latest-fastcomp \
#&& ./emsdk activate latest-fastcomp \
#&& cd ../../
