import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { connectToContext, contextPropTypes } from '@basalt/bedrock-core';
import { Link } from 'react-router-dom';
import { FooterWrapper, FooterMenu, FooterMenuItem } from './footer.styles';

const today = new Date();
const currentYear = today.getFullYear();

const query = gql`
  {
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
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      const { parentBrand } = data.settings;
      return (
        <FooterWrapper>
          <FooterMenu>
            {props.context.features.enableUiSettings && (
              <React.Fragment>
                <FooterMenuItem>
                  <Link to="/settings">Site Settings</Link>
                </FooterMenuItem>
              </React.Fragment>
            )}
          </FooterMenu>
          <p>
            Copyright {currentYear} -{' '}
            {parentBrand && (
              <a
                href={parentBrand.homepage}
                target="_blank"
                rel="noopener noreferrer"
              >
                {parentBrand.title}
              </a>
            )}
          </p>
        </FooterWrapper>
      );
    }}
  </Query>
);

Footer.propTypes = {
  context: contextPropTypes.isRequired,
};

export default connectToContext(Footer);
