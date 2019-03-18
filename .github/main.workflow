workflow "Deploy" {
  on = "push"
  resolves = [
    "alias/simple",
    "alias/design-token-mania",
    "alias/bootstrap",
    "alias/multi-templates",
    "gh-deploy/bootstrap",
    "gh-deploy/design-token-mania",
    "gh-deploy/multi-templates",
    #"cypress",
  ]
}

# Filter for master branch
action "master-branch-filter" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "deploy/simple" {
  needs = "now init"
  uses = "actions/zeit-now@master"
  secrets = [
    "ZEIT_TOKEN",
  ]
  args = "deploy --env EXAMPLE=simple --local-config=./examples/simple/now.json --meta GITHUB_SHA=$GITHUB_SHA --team=basalt"
}

action "deploy/multi-templates" {
  needs = "now init"
  uses = "actions/zeit-now@master"
  secrets = [
    "ZEIT_TOKEN",
  ]
  args = "deploy --env EXAMPLE=multi-templates --local-config=./examples/multi-templates/now.json --meta GITHUB_SHA=$GITHUB_SHA --team=basalt"
}

action "deploy/design-token-mania" {
  needs = "now init"
  uses = "actions/zeit-now@master"
  secrets = [
    "ZEIT_TOKEN",
  ]
  args = "deploy --env EXAMPLE=design-token-mania --local-config=./examples/design-token-mania/now.json --meta GITHUB_SHA=$GITHUB_SHA --team=basalt"
}

action "deploy/bootstrap" {
  needs = "now init"
  uses = "actions/zeit-now@master"
  secrets = [
    "ZEIT_TOKEN",
  ]
  args = "deploy --env EXAMPLE=bootstrap --local-config=./examples/bootstrap/now.json --meta GITHUB_SHA=$GITHUB_SHA --team=basalt"
}

action "ESLint checks" {
  uses = "gimenete/eslint-action@1.0"
  secrets = ["GITHUB_TOKEN"]
}

action "GitHub Action for Slack" {
  uses = "Ilshidur/action-slack@92bd3e50cb4f2b64a6a37d20db2cf723e08f1f7f"
}

workflow "Smoke Tests" {
  on = "push"
  resolves = [
    "lint:js",
    "lint:style",
    "jest",
    "test:examples",
    "build:private",
    "E2E Simple",
  ]
}

action "Not Tag" {
  uses = "actions/bin/filter@d820d56839906464fb7a57d1b4e1741cf5183efa"
  args = "not tag"
}

action "yarn install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install --frozen-lockfile"
  runs = "yarn"
  needs = ["Not Tag"]
}

action "build:pkgs" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["yarn install"]
  runs = "yarn"
  args = "build:pkgs"
}

action "lint:js" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  runs = "yarn"
  needs = ["build:pkgs"]
  args = "lint:js"
}

action "lint:style" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["build:pkgs"]
  runs = "yarn"
  args = "lint:style"
}

action "jest" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["build:pkgs"]
  runs = "yarn"
  args = "jest"
}

action "build:bedrock" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["yarn install"]
  runs = "yarn"
  args = "build:bedrock"
}

action "build:private" {
  uses = "docker://basaltinc/docker-node-php-base:latest"
  needs = ["build:bedrock"]
  runs = "yarn"
  args = "build:private"
}

action "test:examples" {
  uses = "docker://basaltinc/docker-node-php-base:latest"
  needs = ["build:private"]
  runs = "yarn"
  args = "test:examples"
}

action "Filters for GitHub Actions" {
  uses = "actions/bin/filter@d820d56839906464fb7a57d1b4e1741cf5183efa"
  needs = ["deploy/simple"]
  args = "branch master"
}

action "alias/simple" {
  uses = "actions/zeit-now@666edee2f3632660e9829cb6801ee5b7d47b303d"
  needs = ["Filters for GitHub Actions"]
  args = "alias --local-config=./examples/simple/now.json --team=basalt"
  secrets = ["ZEIT_TOKEN"]
}

action "Filters for GitHub Actions-1" {
  uses = "actions/bin/filter@d820d56839906464fb7a57d1b4e1741cf5183efa"
  needs = ["deploy/bootstrap"]
  args = "branch master"
}

action "alias/bootstrap" {
  uses = "actions/zeit-now@666edee2f3632660e9829cb6801ee5b7d47b303d"
  needs = ["Filters for GitHub Actions-1"]
  args = "alias --local-config=./examples/bootstrap/now.json --team=basalt"
  secrets = ["ZEIT_TOKEN"]
}

action "Filters for GitHub Actions-2" {
  uses = "actions/bin/filter@d820d56839906464fb7a57d1b4e1741cf5183efa"
  needs = ["deploy/design-token-mania"]
  args = "branch master"
}

action "alias/design-token-mania" {
  uses = "actions/zeit-now@666edee2f3632660e9829cb6801ee5b7d47b303d"
  needs = ["Filters for GitHub Actions-2"]
  args = "alias --local-config=./examples/design-token-mania/now.json --team=basalt"
  secrets = ["ZEIT_TOKEN"]
}

action "Filters for GitHub Actions-3" {
  uses = "actions/bin/filter@d820d56839906464fb7a57d1b4e1741cf5183efa"
  needs = ["deploy/multi-templates"]
  args = "branch master"
}

action "alias/multi-templates" {
  uses = "actions/zeit-now@666edee2f3632660e9829cb6801ee5b7d47b303d"
  needs = ["Filters for GitHub Actions-3"]
  args = "alias --local-config=./examples/multi-templates/now.json --team=basalt"
  secrets = ["ZEIT_TOKEN"]
}

action "gh-deploy/bootstrap" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["deploy/bootstrap"]
  runs = "node"
  args = "scripts/create-github-deploy.js bootstrap"
  secrets = ["GITHUB_TOKEN", "ZEIT_TOKEN"]
}

action "gh-deploy/design-token-mania" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["deploy/design-token-mania"]
  args = "scripts/create-github-deploy.js design-token-mania"
  runs = "node"
  secrets = ["GITHUB_TOKEN", "ZEIT_TOKEN"]
}

action "gh-deploy/simple" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["deploy/simple"]
  runs = "node"
  args = "scripts/create-github-deploy.js simple"
  secrets = ["GITHUB_TOKEN", "ZEIT_TOKEN"]
}

action "gh-deploy/multi-templates" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["deploy/multi-templates"]
  runs = "node"
  args = "scripts/create-github-deploy.js multi-templates"
  secrets = ["GITHUB_TOKEN", "ZEIT_TOKEN"]
}

# action "cypress" {
#   uses = "docker://cypress/browsers:chrome67"
#   needs = ["gh-deploy/simple"]
#   args = ""
#   runs = ["sh", "-c", "ls .github/artifacts/ && cat .github/artifacts/*.txt && export CYPRESS_BASE_URL=$(cat .github/artifacts/now-url--simple.txt) && echo \"CYPRESS_BASE_URL is: $CYPRESS_BASE_URL\" && yarn && yarn cypress:run"]
#   secrets = ["PERCY_TOKEN"]
# }

action "now init" {
  uses = "actions/zeit-now@666edee2f3632660e9829cb6801ee5b7d47b303d"
  needs = ["master-branch-filter"]
  secrets = ["ZEIT_TOKEN"]
  runs = ["sh", "-c", "now whoami --token=$ZEIT_TOKEN && mkdir .github/artifacts/ "]
}

action "E2E Simple" {
  uses = "docker://basaltinc/docker-node-php-base:latest"
  needs = ["yarn install"]
  runs = "bash"
  args = "./scripts/e2e-simple.sh"
}
