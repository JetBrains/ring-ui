#!/bin/bash

function test {
  mkdir test_gen
  cd test_gen
  npm link ../packages/ring-ui-generator
  ../node_modules/.bin/yo @jetbrains/ring-ui:$1 my-app --widget-name=widget --widget-description=description --widget-author=author
  npm link ../packages/ring-ui-generator
  npm link ../.
  npm run create-component my-component
  npm run ci-test
  npm run build
  cd ..
  rm -rf test_gen
}

test app
test hub-widget
