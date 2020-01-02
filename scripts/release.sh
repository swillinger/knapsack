#!/bin/bash
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
git config --global user.email "$GH_EMAIL"
git config --global user.name "BasaltBot"
git remote remove origin
git remote add origin "https://${GH_TOKEN}@github.com/basaltinc/knapsack.git"
git config --global push.default matching
git fetch
git branch --set-upstream-to=origin/$CIRCLE_BRANCH $CIRCLE_BRANCH
cp ./scripts/.npmrc-ci ~/.npmrc
PREV_VERSION=`git describe --abbrev=0`
# see `lerna.json` for options
# echo "About to run 'lerna version'..."
# ./node_modules/.bin/lerna version --conventional-commits --yes --no-push
# echo "DONE: 'lerna version'"
# echo "------------"
# echo ""

echo "About to run 'lerna publish'..."
# ./node_modules/.bin/lerna publish from-git --yes
./node_modules/.bin/lerna publish --conventional-commits --dist-tag next --create-release github --yes --force-publish --exact
echo "DONE: 'lerna publish'"
echo "------------"
echo ""

echo "About to 'git push'..."
# git push origin "$CIRCLE_BRANCH" --follow-tags --no-verify
echo "DONE: 'git push"
echo "------------"
echo ""

echo ""
echo "------------"
# echo "Legacy Changelog stuff below:"
CURRENT_VERSION=`git describe --abbrev=0`
# echo "Previous version: $PREV_VERSION Current Version: $CURRENT_VERSION"
# echo "changelog test output:"
CHANGES="`git show $PREV_VERSION:CHANGELOG.md | diff -u - CHANGELOG.md | grep '^\+' | grep -v '^\++' | sed -E 's/^\+//'`"
# echo "Creating GitHub release and announcing to issues"
echo "Commenting on related GitHub PRs just released"
echo "$CHANGES"
echo "$CHANGES" | node ./scripts/create-github-release.js "$CURRENT_VERSION"
echo "END: changelog"
