#!/bin/bash
set -x
npm i -g now --unsafe-perm
now --token=$NOW_TOKEN --team=basalt --name='create-bedrock-deploy' --no-clipboard --build-env NPM_TOKEN=@npm-token
