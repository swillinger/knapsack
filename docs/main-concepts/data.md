---
id: data
title: Data Folder
---

When you make changes to your design system, whether it's to the site settings, adding a page-builder example, or custom sections Knapsack will immediately start tracking and documenting these changes in a series of files tucked away in your `/data` folder. After generating a new project this folder should contain the following:

```
└── data
    ├── knapsack.custom-pages.json
    ├── knapsack.page-builder.json
    ├── knapsack.patterns.json
    └── knapsack.settings.json
```

These files are providing the data required to create the visual representations seen on Knapsack's dashboard. Looking at the initial `knapsack.patterns.json` file:

```
{
  "patternTypes": [
    {
      "id": "components",
      "title": "Components"
    }
  ],
  "patternStatuses": [
    {
      "id": "draft",
      "title": "Draft",
      "color": "#9b9b9b"
    },
    {
      "id": "inProgress",
      "title": "In Progress",
      "color": "#FC0"
    },
    {
      "id": "ready",
      "title": "Ready",
      "color": "#00cd00"
    }
  ]
}
```

Updates occur when using the form fields on the dashboard, or the files can be written in directly to make changes.
