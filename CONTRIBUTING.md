# Contributing

Open feature branches against `main`.

## Setup

Use Node.js with npm, CMake 3.22 or newer, and a C++ build toolchain.
The repository includes SEAL and Emscripten as submodules.

```sh
git clone --recurse-submodules https://github.com/s0l0ist/node-seal.git
cd node-seal
npm ci
npm run update:emsdk
```

`update:emsdk` installs and activates `latest` from the checked-out emsdk version.
Use `update:submodule` when you want to update the submodules themselves.

## Build and test

```sh
npm run build
npm run compile
npm test
```

`build` generates both Wasm variants. `compile` copies the package files to
`dist`. When changing bindings, check both variants and their generated types.

Clean generated artifacts with `npm run clean`. See [benchmarks](BENCHMARK.md)
for the native and Wasm benchmark commands.
