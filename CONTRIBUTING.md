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
make -j
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
npm run em:update      # Updates the tag information
```

Finally, configure the Microsoft SEAL build settings:

```shell
npm run build          # Will build the two MS-SEAL variants (allows, throws), supporting `node`, `web`, and `worker` emscripten environments
npm run test           # Will run jest tests on the *.ts files
npm run coverage       # Check coverage
npm run compile        # Test compile before bundling, useful for debugging
```

To clean all generated artifacts:

```shell
npm run clean
```

If you want to build your own bundle, perform the steps above and then the following:

```shell
npm run rollup         # Compiles all TS files, generates declarations, performs minification and places them into `./dist`
npm run publish:test   # Simulates publishing the bundle to `node-seal`
```
