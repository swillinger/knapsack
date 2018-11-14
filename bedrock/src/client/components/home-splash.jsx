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

const HomeSplash = ({ context }) => (
  <HomeSplashWrapper>
    <HomeSplashCore>
      {context.settings.subtitle && (
        <EyeBrow>{context.settings.subtitle}</EyeBrow>
      )}
      <Title>{context.settings.title}</Title>
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
