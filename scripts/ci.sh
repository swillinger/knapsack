#!/bin/bash
set -x
set -e
# Start in scripts/ even if run from root directory
cd "$(dirname "$0")"
# Run everything from root of repo
cd ..

if [ "$TRAVIS_TAG" ]; then
  echo "Tag build $TRAVIS_TAG"
  echo "========"
  echo "START: deploy"
  echo "========"
  ./scripts/create-bedrock-deploy/deploy.sh;
  echo "========"
  echo "END: deploy"
  echo "========"

else

  echo "Not tag build"

  echo "========"
  echo "START: yarn build:all"
  echo "========"
  yarn build:all
  echo "========"
  echo "END: yarn build:all"
  echo "========"

  echo "========"
  echo "START: yarn test"
  echo "========"
  yarn test
  echo "========"
  echo "END: yarn test"
  echo "========"

  echo "========"
  echo "START: e2e-simple"
  echo "========"
  if [ "$TRAVIS_PULL_REQUEST" ]; then
    git checkout $TRAVIS_PULL_REQUEST_BRANCH
  else
    git checkout $TRAVIS_BRANCH
  fi
  ./scripts/e2e-simple.sh
  echo "========"
  echo "END: e2e-simple"
  echo "========"

  if [ "$TRAVIS_BRANCH" = "master" ]; then
    echo "On master branch"
    echo "========"
    echo "START: release"
    echo "========"
    ./scripts/release.sh;
    git pull origin "$TRAVIS_BRANCH"
    git push origin "$TRAVIS_BRANCH" --follow-tags --no-verify
    echo "========"
    echo "END: release"
    echo "========"
  fi

fi
