#!/bin/bash
set -x
set -e
# Start in this directory even if ran elsewhere
cd "$(dirname "$0")"
cd ..

if [ -n "$(git status --porcelain)" ]; then
  echo "Your git status is not clean. Aborting.";
  exit 1;
fi

# git reset --hard HEAD && git checkout master
# if `~/.npmrc` does not exist, copy `./scripts/.npmrc-ci` there
#test -e ~/.npmrc || cp ./scripts/.npmrc-ci ~/.npmrc
# hmm.. that's not working; perhaps CI has `~/.npmrc`
git config --global user.email $GITHUB_EMAIL
git config --global user.name "Bedrock Bot"
cp ./scripts/.npmrc-ci ~/.npmrc
# see `lerna.json` for options
./node_modules/.bin/lerna publish --yes
