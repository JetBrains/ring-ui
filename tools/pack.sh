#!/bin/bash
version=$(npm version $npm_package_config_version) &&
echo $version &&
rm -rf package &&
mkdir package &&

find .\
  -regex './package.json' -or \
  -regex './README.md' -or \
  -regex './ring-upsource.js' -or \
  -regex './ring-upsource-dev.js' -or \
  -regex './webpack.config.js' -or \
  -regex './.babelrc' -or \
  -regex './components/.*/.*.js' -or \
  -regex './components/.*/.*.scss' -or \
  -regex './components/.*/.*.gif' -or \
  -regex './components/.*/.*.svg' -or \
  -regex './components/.*/.*.html' \
  | cpio -pdm package &&

tar -czf ring-ui-${version:1}.tgz package &&
rm -rf package &&
echo
