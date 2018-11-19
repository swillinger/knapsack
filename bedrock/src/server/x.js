const { Settings } = require('./settings');

const settings = new Settings({ dataDir: '/Users/marywarrington/Dev/basalt/bedrock/examples/simple/data' });

const a = {
  "title": "hi",
  "subtitle": "A Simple Example of a Design System",
  "slogan": "Wasn't that simple?"
};

settings.setSettings(a);
