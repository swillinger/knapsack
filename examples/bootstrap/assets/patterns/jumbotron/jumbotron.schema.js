module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Jumbotron',
  description: '\n' +
    'A lightweight, flexible component that can optionally extend the entire viewport to showcase key marketing messages on your site.',
  required: ['title'],
  properties: {
    "title": {
        "title": "Title",
        "type": "string",
        "description": "Main heading title in this jumbotron."
    },
    "body": {
        "title": "Body Copy",
        "type": "string",
        "description": "This is the body copy that will appear in the jumbotron."
    },

    "ctaText": {
        "title": "Button Text",
        "type": "string",
        "description": "Text inside the button"
    }

  },
  examples: [
    {
      title: "Jumbotron",
      body: "Twenty four hour hydration and sheer color helps me look flawless even when faced with that unforgiving Jumbotron! - Lindsey Vonn",
      ctaText: "Button",
    },
  ],
};
