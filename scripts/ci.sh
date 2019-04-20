#!/bin/bash
set -x
set -e
# Start in scripts/ even if run from root directory
cd "$(dirname "$0")"
# Run everything from root of repo
cd ..

if [ "$CIRCLE_TAG" ]; then
  echo "Tag build $CIRCLE_TAG"
  echo "========"
  echo "START: deploy"
  echo "========"
  ./scripts/create-knapsack-deploy/deploy.sh;
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

  if [[ "$CIRCLE_BRANCH" == "master" ]]; then
    echo "On master branch"
    echo "========"
    echo "START: release"
    echo "========"
    ./scripts/release.sh
    git pull origin "$CIRCLE_BRANCH"
    git push origin "$CIRCLE_BRANCH" --follow-tags --no-verify
    echo "========"
    echo "END: release"
    echo "========"
  fi

fi
