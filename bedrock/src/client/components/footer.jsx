import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Spinner from '@basalt/bedrock-spinner';
import { connectToContext, contextPropTypes } from '@basalt/bedrock-core';
import { Link } from 'react-router-dom';
import {
  FooterWrapper,
  FooterMenu,
  FooterMenuItem,
  FooterInner,
  SubFooterWrapper,
} from './footer.styles';

const today = new Date();
const currentYear = today.getFullYear();

const query = gql`
  {
    meta {
      bedrockVersion
    }
    settings {
      parentBrand {
        homepage
        title
      }
    }
  }
`;

const Footer = props => (
  <Query query={query}>
    {({ loading, error, data }) => {
      if (loading) return <Spinner />;
      if (error) return <p>Error :(</p>;
      const { parentBrand } = data.settings;
      return (
        <FooterWrapper>
          <FooterInner>
            <FooterMenu>
              {props.context.features.enableUiSettings && (
                <React.Fragment>
                  <FooterMenuItem>
                    <Link to="/settings">Site Settings</Link>
                  </FooterMenuItem>
                  <FooterMenuItem>
                    <Link to="/feedback">Feedback</Link>
                  </FooterMenuItem>
                </React.Fragment>
              )}
            </FooterMenu>
            <p>
              Copyright {currentYear}{' '}
              {parentBrand.title && parentBrand.homepage && (
                <a
                  href={parentBrand.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  - {parentBrand.title}
                </a>
              )}
              {!parentBrand.title && parentBrand.homepage && (
                <a
                  href={parentBrand.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  - {parentBrand.homepage}
                </a>
              )}
              {parentBrand.title && !parentBrand.homepage && (
                <>- {parentBrand.title}</>
              )}
            </p>
            <p>
              Built on{' '}
              <a
                href="https://www.getbedrock.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Bedrock
              </a>{' '}
              {data.meta.bedrockVersion} by{' '}
              <a
                href="https://basalt.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Basalt
              </a>
            </p>
          </FooterInner>
          <SubFooterWrapper>
            <p>
              Download or use of this software is governed by our license
              agreement available{' '}
              <a
                href="http://license.getbedrock.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
            </p>
          </SubFooterWrapper>
        </FooterWrapper>
      );
    }}
  </Query>
);

Footer.propTypes = {
  context: contextPropTypes.isRequired,
};

export default connectToContext(Footer);
