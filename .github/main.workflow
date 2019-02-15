workflow "New workflow" {
  on = "push"
  resolves = ["deploy"]
}

# Filter for master branch
action "master-branch-filter" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "deploy" {
  needs = "master-branch-filter"
  uses = "actions/zeit-now@master"
  secrets = [
    "ZEIT_TOKEN",
  ]
  args = "deploy examples/simple"
}
