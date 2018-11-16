#!/bin/bash
npm i -g now --unsafe-perm
now --build-env NPM_TOKEN=@npm-token
