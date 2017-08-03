#!/bin/bash

function cleanup {
  cd ..
  rm -rf test_gen
}

function handle_error {
  cleanup
  exit 1
}

function test {
  mkdir test_gen
  cd test_gen
  npm link ../packages/ring-ui-generator || handle_error
  ../node_modules/.bin/yo @jetbrains/ring-ui:$1 my-app --widget-name=widget --widget-description=description --widget-author=author || handle_error
  npm link ../packages/ring-ui-generator || handle_error
  npm link ../. || handle_error
  npm run create-component my-component || handle_error
  npm run ci-test || handle_error
  npm run build || handle_error
  cleanup
}

if [ -v IS_DEFAULT_BRANCH ]
then
  exit 0
fi

rm -rf test_gen
test app
test hub-widget
