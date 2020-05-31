# Contributing

We welcome help on this project, but please create all PRs with feature branches onto Master.

### Requirements

#### Cmake > 3.12

Download latest stable cmake from:
https://cmake.org/download/

Install:

```shell
cd ./cmake-3.15.4
./bootstrap
make -j4
sudo make install
```

### Development

The repository contains a few submodules:

- [Emscripten SDK](https://github.com/emscripten-core/emsdk)
- [Microsoft SEAL](https://github.com/microsoft/SEAL)

To begin development, first clone the repository and related submodules

```shell
git clone --recursive https://github.com/morfix-io/node-seal.git

cd node-seal

npm install
```

Inside [package.json](package.json), we have several scripts to help generate the Web
Assembly code.

First, initialize the Emscripten SDK build environment. This sets up a known working version
of the SDK to build the project:

```shell
# npm run submodule:update # If you forgot to clone recursively
npm run em:update      # Updates the tag information
npm run em:init        # Sets up the working toolchain
```

Finally, configure the Microsoft SEAL build settings:

```shell
npm run seal:clean     # When you want to remove all artifacts
npm run seal:cmake     # Do this once
npm run seal:make      # Will begin building the SEAL static library
npm run seal:build     # Will compile both the Web Assembly and JS build from the library
npm run build          # Will build both the web and node supporting JS and Web Assembly to be packed for npm
```

Testing requires a seal:build to have completed successfully.
All test should pass and coverage should be 100% when making contributions.
**Note**: this could a few minutes and is very CPU/memory intensive.

```shell
npm run coverage
```

If successful, submit PR!
