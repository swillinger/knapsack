#!/bin/bash

# Exit the script on any command with non 0 return code
# We assume that all the commands in the pipeline set their return code
# properly and that we do not need to validate that the output is correct
set -e

# Go to root
cd "$(dirname "$0")"
cd ..

if [ -n "$(git status --porcelain)" ]; then
  echo "Your git status is not clean. Aborting.";
  git status
  echo "";
  echo "-----";
  echo "";
  git diff
  exit 1;
fi
