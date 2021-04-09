#!/usr/bin/env bash

# Sets up llvm.
cd submodules/emsdk/
git checkout master
git fetch upstream
git merge upstream/master --no-edit
./emsdk install latest
./emsdk activate latest
cd ../../
