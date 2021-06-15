#!/usr/bin/env bash

# Sets up llvm.
cd submodules/emsdk/
git checkout main
git fetch upstream
git merge upstream/main --no-edit
./emsdk install latest
./emsdk activate latest
cd ../../
