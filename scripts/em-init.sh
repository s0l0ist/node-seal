#!/usr/bin/env bash

# Sets up llvm.
cd submodules/emsdk/
./emsdk install latest
./emsdk activate latest
cd ../../
