---
id: getting-started
title: Getting Started
---

The following tutorial will get you started with a new project, prompt the use of any requirements to run a new design system, explain what the files of your starting directory are doing for you, as well as take you through the steps of building a new component so you can really hit the ground running. 🏃 Let's get started!

>Note: Knapsack requires Node.js 8 or higher, and PHP 7 - though only for the php cli, and not the ability to serve full php sites (i.e. PHP CGI nor Apache is needed).

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

After running the setup commands Knapsack will create a directory inside the current folder. In that directory, it will generate the initial project file structure:

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

Your `patterns` folder is where you'll place any new component files as a default, there's even a few examples included already to get an idea of how they're structured. To see them on your dashboard view follow the header navigation link for `patterns`, and there will be three options in your pattern list:

* Button
* Hero
* Card

Go ahead and click on `button` to see the rendered component and it's attributes. In the next section we'll take a look at the what is going into making this component, and how we can edit it with our dashboard user interface.
