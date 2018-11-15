import React from 'react';
import { connectToContext, contextPropTypes } from '@basalt/bedrock-core';
import {
  HomeSplashCore,
  EyeBrow,
  HomeSplashWrapper,
  Subtitle,
  Title,
  VersionTag,
} from './home-splash.styles';

/**
 * @param {string} x
 * @returns {number}
 * @todo set maximum font size here or in the vw logic
 */
function bigWords(x) {
  // split up the title to individual words
  const titleWords = x.split(' ');
  // find the longest word
  /** @type number */
  const longestLength = titleWords.sort((a, b) => b.length - a.length)[0]
    .length;
  let vw = 19;
  // switch does not have breaks because we are SURE there will only ever be ONE case satisfied.
  /* eslint-disable no-fallthrough, default-case */
  switch (longestLength) {
    case 9:
      vw = 17;
    case 10:
      vw = 15;
    case 11:
      vw = 13.5;
    case 12:
      vw = 12;
    case 13:
      vw = 11;
    case 14:
      vw = 10;
    case 15:
      vw = 9;
    case 16:
      vw = 8;
    case 17:
      vw = 7;
    case 18:
      vw = 7;
    case 19:
      vw = 7;
    case 20:
      vw = 7;
    case 21:
      vw = 6;
    case 22:
      vw = 6;
    case 23:
      vw = 6;
    case 24:
      vw = 5.5;
    case 25:
      vw = 5.5;
  }
  /* eslint-enable */

  return vw;
}

const HomeSplash = ({ context }) => (
  <HomeSplashWrapper>
    <HomeSplashCore>
      {context.settings.subtitle && (
        <EyeBrow>{context.settings.subtitle}</EyeBrow>
      )}
      {context.settings.title && (
        <Title vw={bigWords(context.settings.title)}>
          {context.settings.title}
        </Title>
      )}
      {context.settings.slogan && (
        <Subtitle>{context.settings.slogan}</Subtitle>
      )}
      {context.settings.version && (
        <VersionTag>{context.settings.version}</VersionTag>
      )}
    </HomeSplashCore>
  </HomeSplashWrapper>
);

HomeSplash.propTypes = {
  context: contextPropTypes.isRequired,
};

export default connectToContext(HomeSplash);
