#!/bin/bash

set -e -x

cd ../..
yarn link
cd packages/generator
yarn link

function test {
  rm -rf test_gen
  mkdir test_gen
  cd test_gen
  yarn link @jetbrains/generator-ring-ui
  ../../../node_modules/.bin/yo @jetbrains/ring-ui:$1 my-app --widget-name=widget --widget-description=description --widget-author=author
  yarn link @jetbrains/generator-ring-ui
  yarn link @jetbrains/ring-ui
  yarn create-component my-component
  yarn ci-test
  yarn build
  cd ..
}

test app
test hub-widget
