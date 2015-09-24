#!/bin/sh
version=$(npm version $npm_package_config_version) &&
echo $version &&
rm -rf package &&
mkdir package &&

find -E . -regex \
  './((package.json)|(README.md)|(ring-upsource.js)|(webpack.config.js)|(components/.*/.*.(js|scss|png|gif|svg|ttf|woff|eof|html)))'\
  | cpio -pdm package &&

tar -czf ring-ui-${version:1}.tar.gz package &&
rm -rf package &&
echo
