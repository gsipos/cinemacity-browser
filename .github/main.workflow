workflow "Project build" {
  on = "push"
  resolves = [
    "Check formatting",
    "Lint",
    "Compile",
    "firebase",
  ]
}

action "Install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "ci"
}

action "Build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install"]
  args = "run build"
}

action "Check formatting" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install"]
  args = "run prettier"
}

action "Lint" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install"]
  args = "run tslint"
}

action "Compile" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install"]
  args = "run compile"
}

action "Only on master" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  needs = ["Build"]
  args = "branch master"
}

action "Deploy" {
  uses = "w9jds/firebase-action@master"
  needs = ["Only on master"]
  args = "deploy --only hosting"
  secrets = ["FIREBASE_TOKEN"]
}
