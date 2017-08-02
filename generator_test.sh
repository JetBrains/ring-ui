#!/bin/bash

function test {
  npm link ../packages/ring-ui-generator || exit 1
  ../node_modules/.bin/yo @jetbrains/ring-ui:$1 my-app --widget-name=widget --widget-description=description --widget-author=author || exit 1
  npm link ../packages/ring-ui-generator || exit 1
  npm link ../. || exit 1
  npm run create-component my-component || exit 1
  npm run ci-test || exit 1
  npm run build || exit 1
}

function setup {
  mkdir test_gen
  cd test_gen
  test $1
  code=$?
  cd ..
  rm -rf test_gen
  exit $code
}

setup app && setup hub-widget
