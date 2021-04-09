#!/usr/bin/env bash

rm -rf ./src/bin/js/* ./src/bin/wasm/*
cd ./submodules/SEAL/
rm -rf ./build
rm -rf ./thirdparty
cd ../../
