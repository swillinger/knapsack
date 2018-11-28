#!/bin/bash
set -x
set -e
# Start in this directory even if ran elsewhere
cd "$(dirname "$0")"
npm i -g now --unsafe-perm
now deploy --token=$NOW_TOKEN --team=basalt --no-clipboard --build-env NPM_TOKEN=@npm-token --build-env CIRCLE_BUILD_URL=$CIRCLE_BUILD_URL --force --meta CIRCLE_BUILD_URL=$CIRCLE_BUILD_URL --meta CIRCLE_COMPARE_URL=$CIRCLE_COMPARE_URL
now alias --token=$NOW_TOKEN --team=basalt
now rm create-bedrock-demo --safe --yes --token=$NOW_TOKEN --team=basalt
