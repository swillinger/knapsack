#!/bin/bash
set -x
set -e
# Start in this directory even if ran elsewhere
cd "$(dirname "$0")"
cd ..
# git reset --hard HEAD && git checkout master
# if `~/.npmrc` does not exist, copy `./scripts/.npmrc-ci` there
test -e ~/.npmrc || cp ./scripts/.npmrc-ci ~/.npmrc
# see `lerna.json` for options
./node_modules/.bin/lerna publish --yes
