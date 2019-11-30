# Contributing

We welcome help on this project, but please create all PRs with feature branches onto Master.

### Requirements
#### Cmake > 3.12

Download latest stable cmake from:
https://cmake.org/download/

Install:

```
cd ./cmake-3.15.4
./bootstrap
make -j4
sudo make install
```

### Development

The repository contains a couple of submodules:
- [Emscripten SDK](https://github.com/emscripten-core/emsdk)
- [Microsoft SEAL](https://github.com/microsoft/SEAL)

To begin development, first clone the repository and related submodules
```
git clone --recursive https://github.com/morfix-io/node-seal.git

cd node-seal

yarn install
```

Inside [package.json](package.json), we have several scripts to help generate the Web 
Assembly code.

First, initialize the Emscripten SDK build environment. This sets up a known working version
of the SDK to build the project:

```
yarn em:update      # Updates the tag information
yarn em:init        # Sets up the working toolchain
```

Next, compile zlib:
```
yarn zlib:clean     # When you want to remove all artifacts
yarn zlib:cmake     # Do this once
yarn zlib:make      # Will begin building the zlib static library
```

Finally, configure the Microsoft SEAL build settings:

```
yarn seal:clean     # When you want to remove all artifacts
yarn seal:cmake     # Do this once
yarn seal:make      # Will begin building the SEAL static library
yarn seal:build     # Will compile the Web Assembly file from the shared library
```

All test should pass when making contributions to the Web Assembly module. 
**Note**: this could a few minutes and is very CPU/memory intensive.

```
yarn test
```

If successful, submit PR!
