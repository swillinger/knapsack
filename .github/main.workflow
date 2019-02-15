workflow "Deploy" {
  on = "push"
  resolves = [
    "alias simple",
    "alias design-token-mania",
    "alias multi-template",
    "alias bootstrap",
  ]
}

# Filter for master branch
action "master-branch-filter" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "deploy/simple" {
  needs = "master-branch-filter"
  uses = "actions/zeit-now@master"
  secrets = [
    "ZEIT_TOKEN",
  ]
  args = "deploy examples/simple --team=basalt"
}

action "deploy/multi-templates" {
  needs = "master-branch-filter"
  uses = "actions/zeit-now@master"
  secrets = [
    "ZEIT_TOKEN",
  ]
  args = "deploy examples/multi-templates --team=basalt"
}

action "deploy/design-token-mania" {
  needs = "master-branch-filter"
  uses = "actions/zeit-now@master"
  secrets = [
    "ZEIT_TOKEN",
  ]
  args = "deploy examples/design-token-mania --team=basalt"
}

action "deploy/bootstrap" {
  needs = "master-branch-filter"
  uses = "actions/zeit-now@master"
  secrets = [
    "ZEIT_TOKEN",
  ]
  args = "deploy examples/bootstrap --team=basalt"
}

action "alias bootstrap" {
  uses = "actions/zeit-now@master"
  needs = ["deploy/bootstrap"]
  args = "alias --local-config=./examples/bootstrap/now.json --team=basalt"
  secrets = ["ZEIT_TOKEN"]
}

action "alias multi-template" {
  uses = "actions/zeit-now@master"
  needs = ["deploy/multi-templates"]
  args = "alias --local-config=./examples/multi-templates/now.json --team=basalt"
  secrets = ["ZEIT_TOKEN"]
}

action "alias simple" {
  uses = "actions/zeit-now@master"
  needs = ["deploy/simple"]
  args = "alias --local-config=./examples/simple/now.json --team=basalt"
  secrets = ["ZEIT_TOKEN"]
}

action "alias design-token-mania" {
  uses = "actions/zeit-now@master"
  needs = ["deploy/design-token-mania"]
  args = "alias --local-config=./examples/design-token-mania/now.json --team=basalt"
  secrets = ["ZEIT_TOKEN"]
}

workflow "Lint" {
  on = "push"
  resolves = [
    "ESLint checks",
  ]
}

action "ESLint checks" {
  uses = "gimenete/eslint-action@1.0"
  secrets = ["GITHUB_TOKEN"]
}
