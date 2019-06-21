---
id: getting-started
title: Getting Started
---

The following tutorial will get you started with a new project, explain what the files of your starting directory are doing for you, prompt the use of any requirements to run a new design system, as well as take you through the steps of building a new component so you can really hit the ground running. 🏃 Let's get started!

>Note: Knapsack requires Node.js 8 or higher, and PHP 7 - though only for the php cli, and not the ability to serve full php sites (aka PHP CGI nor Apache is needed).

## Initializing a New Project

No need to create a new directory! In your terminal, run the following commands, replacing `my-design-system` with the name of your design system:

```bash
npm create knapsack my-design-system 
cd my-design-system 
npm install 
npm start 
```
`npm start` is going to compile, and then start all watches on your local server. Make sure that PORT 3999 is availble. Than open https://localhost:3999 to see your design system dashboard.

### Output

After running the setup commands Knapsack will create a directory called ‘my-design-system’ inside the current folder. In that directory, it will generate the initial project file structure:

```
my-design-system
├── assets
|   └── patterns
├── data
|   ├── knapsack.custom-pages.json
|   ├── knapsack.page-builder.json
|   ├── knapsack.patterns.json
|   └── knapsack.settings.json
├── design-tokens
├── docs
├── public
|   ├── assets
|   └── images
├── dockerfile
├── knapsack.config.js
├── now.json
├── package-lock.json
├── package.json
└── readme.md
```

Your `patterns` folder is where you'll place any new component files as a default, there's even a few examples in there already for you to get an idea of how they're structured. In the next section we're going to take a minute to go through what some of the files in the root directory are doing before we jump into building.

