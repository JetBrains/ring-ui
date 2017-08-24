#!/bin/bash

set -e -x

cd ../..
npm link
cd packages/ring-ui-generator
npm link

function test {
  rm -rf test_gen
  mkdir test_gen
  cd test_gen
  npm link @jetbrains/generator-ring-ui
  ../../../node_modules/.bin/yo @jetbrains/ring-ui:$1 my-app --widget-name=widget --widget-description=description --widget-author=author
  npm link @jetbrains/generator-ring-ui
  npm link @jetbrains/ring-ui
  npm run create-component my-component
  npm run ci-test
  npm run build
  cd ..
}

test app
test hub-widget
