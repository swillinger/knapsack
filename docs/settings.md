---
id: dashboard-settings
title: Dashboard Settings
---

## Overview
In this section we're going to go over what parts of your dashboard can be customized to match the feel of your project. The front-page, configurable header links, and custom sections can be created with this feature.

## Site Settings
The associated edit form is accessible via link in the footer, titled <a href="http://localhost:3999/settings" target="_blank">Site Settings</a>.

**Options to configure are included below:**

#### Knapsack Settings-
These fields are used to change the default names of your design system.

* Title
    * The `Title` of your project is going to always appear in the upper, left-hand corner of each page view, as well as becoming the largest heading in the center of your front-page. This is intended for the name of your design system.
* Subtitle
    * The `Subtitle` is going to appear just above your Title heading on the front page. This setting could be used to name the company or owner of the design system.
* Slogan
    * The `Slogan` is going to appear just below your Title heading on the front page. This setting could be used for a company slogan, tagline, or some other information you might wish to impart to someone using your design system for the first time.


#### Parent Brand Settings-
These fields are used to create a custom link button at the upper, right-hand corner of each page view, and tyipically will redirect the user to a company homepage or similar.

* Logo
    * The `Logo` field is going to take a URI or an image file and appear as an icon button (As a default you add your image files to `/public/images`).
* Title
    * The `Title` is going to act as your logo's alternative text.
* Homepage
    * The `Homepage` is going to take a URI.

#### Custom Sections-
At the left of each page view should be a side menu with the default sections `Patterns`, `Page Builder`, `Docs`, and `API`. You can create your own `Custom Sections` to add to this list to fit your needs.

1) Click on the `+` icon and two input fields `Section Title` and `Section ID` will become available to you. You can add a title name like `Example Pages`, and the ID can be the same as long as it's lowercase and hyphenated: `example-pages`. Make sure that your ID is unique, if other sections in your design system share an ID Knapsack will throw errors.
2) If you wish for this new section to appear in the top Main Menu, toggle the `Show in Main Menu` option. 
2) Next you will add new custom pages within the `Custom Section` you just created. Click on the `+` icon under `Custom Pages` and input your names to `Page Title` and `Page ID` just as before. (Example: `Page 1` and `page-one`) Those pages will appear in the left sidebar under the heading for your custom section.
3) Now you can open those pages within your browser and edit the page to include custom blocks and other rich content.

>Note: `Knapsack Settings`, `Parent Brand`, and `Custom Sections` share a submit button.

#### Pattern Types
You might have a variety of different patterns types to keep track of. This section allows you to add or edit those pattern types within the system to best suit your needs.

1) `Pattern Types` require a Title and ID, and repressent whatever pattern quality you desire (Example: Buttons, Headers, Layouts, Etc.).
2) The up and down arrows can be clicked to shift the order of the `Pattern Types`, and the trash icon will delete the specified type.

#### Pattern Statuses
Pattern Statuses are generally used to determine in what state of development a particular pattern is in (Example: Work in Progress, Deprecated, Needs Review).

1) `Pattern Statuses` require a Title and ID, and for each you can select it's associated color.
2) The up and down arrows can be clicked to shift the order of the `Pattern Statuses`, and the trash icon will delete the specified type.

>Note: `Pattern Types`, and `Pattern Statuses` share a submit button.
