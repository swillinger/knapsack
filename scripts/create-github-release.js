#! /usr/bin/env node
const readline = require('readline');
const {
  commentOnIssue,
  createRelease,
  parseChangelog,
} = require('./github-util');

const tag = process.argv[2];

if (!tag) {
  console.log('No tag passed in as first arg');
  process.exit(0);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const lines = [];
rl.on('line', line => lines.push(line));

rl.on('close', async () => {
  const changelog = lines.join('\n');
  if (!changelog) {
    console.log('No changelog found');
    process.exit(0);
  }
  await createRelease(tag, changelog.trim());
  const { issues } = parseChangelog(changelog);
  if (issues) {
    const issueResults = await Promise.all(
      issues.map(issue =>
        commentOnIssue(
          issue,
          `Released in [${tag}](https://github.com/basaltinc/knapsack/releases/tag/${tag})`,
        ),
      ),
    );
    issueResults.forEach(result => {
      console.log(`👍 Issue commented on: ${result.html_url}`);
    });
  }
  console.log('Done');
});
