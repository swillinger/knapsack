const {
  bootstrap,
  bootstrapFromConfigFile,
  getBrain,
} = require('./lib/bootstrap');
const { bedrockEvents, EVENTS } = require('./server/events');
const log = require('./cli/log');
const { BedrockRendererBase } = require('./server/renderer-base');
const {
  BedrockRendererWebpackBase,
} = require('./server/renderer-webpack-base');
const {
  styleDictionaryBedrockFormat,
  theoBedrockFormat,
} = require('./server/design-tokens');

module.exports = {
  BedrockRendererBase,
  BedrockRendererWebpackBase,
  bedrockEvents,
  EVENTS,
  log,
  styleDictionaryBedrockFormat,
  theoBedrockFormat,
  bootstrapFromConfigFile,
  bootstrap,
  getBrain,
};
