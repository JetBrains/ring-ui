#!/bin/bash

set -e -x

cd ../..
npm link
cd packages/generator
npm link

# We have to copy instead of linking because of possible different versions of dependencies like Webpack
function copyRingUI {
  set +e
  cp -f ../../../* ./node_modules/@jetbrains/ring-ui/
  set -e
  cp -fr ../../../components ./node_modules/@jetbrains/ring-ui
}

function test {
  rm -rf test_gen
  mkdir test_gen
  cd test_gen
  npm link @jetbrains/generator-ring-ui
  ../../../node_modules/.bin/yo --no-insight @jetbrains/ring-ui:$1 my-app --widget-name=widget --widget-description=description --widget-author=author
  npm install
  npm link @jetbrains/generator-ring-ui
  copyRingUI
  npm run create-component my-component
  npm run ci-test
  npm run build
  cd ..
}

test app
test hub-widget
