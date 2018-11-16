#!/bin/bash
set -x
# Start in this directory even if ran elsewhere
cd "$(dirname "$0")"
npm i -g now --unsafe-perm
now --token=$NOW_TOKEN --team=basalt --name='create-bedrock-deploy' --no-clipboard --build-env NPM_TOKEN=@npm-token
