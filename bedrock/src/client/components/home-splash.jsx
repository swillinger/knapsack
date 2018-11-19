import React from 'react';
import { connectToContext } from '@basalt/bedrock-core';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Spinner from '@basalt/bedrock-spinner';
import { StatusMessage } from '@basalt/bedrock-atoms';
import {
  HomeSplashCore,
  EyeBrow,
  HomeSplashWrapper,
  Subtitle,
  Title,
  VersionTag,
} from './home-splash.styles';

const query = gql`
  {
    settings {
      title
      subtitle
      slogan
    }
  }
`;

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

const HomeSplash = () => (
  <Query query={query}>
    {({ loading, error, data }) => {
      if (loading) return <Spinner />;
      if (error) return <StatusMessage message={error.message} type="error " />;

      const { settings } = data;
      return (
        <HomeSplashWrapper>
          <HomeSplashCore>
            {settings.subtitle && <EyeBrow>{settings.subtitle}</EyeBrow>}
            {settings.title && (
              <Title vw={bigWords(settings.title)}>{settings.title}</Title>
            )}
            {settings.slogan && <Subtitle>{settings.slogan}</Subtitle>}
            {settings.version && <VersionTag>{settings.version}</VersionTag>}
          </HomeSplashCore>
        </HomeSplashWrapper>
      );
    }}
  </Query>
);

export default connectToContext(HomeSplash);
