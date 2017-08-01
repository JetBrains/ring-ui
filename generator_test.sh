#!/bin/bash

mkdir test_gen
cd test_gen
yo @jetbrains/ring-ui my-app
npm run component my-component
npm run ci-test
npm run build
cd ..
rm -rf test_gen
