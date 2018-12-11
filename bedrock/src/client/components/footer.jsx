/**
 *  Copyright (C) 2018 Basalt
    This file is part of Bedrock.
    Bedrock is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Bedrock is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Bedrock; if not, see <https://www.gnu.org/licenses>.
 */
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
