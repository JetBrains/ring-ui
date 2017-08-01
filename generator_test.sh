#!/bin/bash

mkdir test_gen
cd test_gen
npm link ../packages/ring-ui-generator
yo @jetbrains/ring-ui my-app
npm link ../packages/ring-ui-generator
npm link ../.
npm run create-component my-component
npm run ci-test
npm run build
cd ..
rm -rf test_gen
