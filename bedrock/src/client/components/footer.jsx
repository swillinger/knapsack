import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Spinner from '@basalt/bedrock-spinner';
import { Link } from 'react-router-dom';
import {
  FooterWrapper,
  FooterMenu,
  FooterMenuItem,
  FooterInner,
  FooterBuiltOn,
  FooterBuiltOnImg,
  FooterBuiltOnInner,
  FooterCreatedByImg,
  SubFooterWrapper,
} from './footer.styles';
import bedrockBranding from '../assets/built-on.svg';
import createdBy from '../assets/created-by.svg';

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

function Footer() {
  return (
    <Query query={query}>
      {({ loading, error, data }) => {
        if (loading) return <Spinner />;
        if (error) return <p>Error :(</p>;
        return (
          <FooterWrapper>
            <FooterInner>
              <FooterMenu>
                <FooterMenuItem>
                  <Link to="/settings">Site Settings</Link>
                </FooterMenuItem>
                <FooterMenuItem>
                  <Link to="/feedback">Feedback</Link>
                </FooterMenuItem>
              </FooterMenu>
              <FooterBuiltOn>
                <FooterBuiltOnInner>
                  {data.meta.bedrockVersion}
                </FooterBuiltOnInner>
                <a
                  href="https://www.getbedrock.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FooterBuiltOnImg src={bedrockBranding} alt="Bedrock" />
                </a>
                <a
                  href="https://basalt.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FooterCreatedByImg src={createdBy} alt="Created by" />
                </a>
              </FooterBuiltOn>
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
}

export default Footer;
