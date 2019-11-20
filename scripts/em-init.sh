#!/usr/bin/env bash

# as of 11/19/2019, the incoming release works, but not sdk-1.39.2.
cd submodules/emsdk/ && ./emsdk install sdk-incoming-64bit && ./emsdk activate sdk-incoming-64bit && cd ../../
