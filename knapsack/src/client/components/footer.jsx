/**
 *  Copyright (C) 2018 Basalt
    This file is part of Knapsack.
    Knapsack is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Knapsack is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Spinner from '@knapsack/spinner';
import { KnapsackContext } from '@knapsack/core';
import { Link } from 'react-router-dom';
import {
  FooterWrapper,
  FooterMenu,
  FooterMenuItem,
  FooterInner,
  FooterBuiltOn,
  FooterBuiltOnImg,
  FooterBuiltOnInner,
  // FooterCreatedByImg,
  SubFooterWrapper,
} from './footer.styles';
import knapsackBranding from '../assets/knapsack-bg-black-trans.svg';
// import createdBy from '../assets/created-by.svg';

const query = gql`
  {
    meta {
      knapsackVersion
      changelog
    }
    #    settings {
    #      parentBrand {
    #        homepage
    #        title
    #      }
    #    }
  }
`;

class Footer extends Component {
  static contextType = KnapsackContext;

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Query query={query}>
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;
          if (error) return <p>Error :(</p>;
          const {
            meta: { knapsackVersion, changelog },
            // settings: { parentBrand },
          } = data;
          return (
            <FooterWrapper>
              <FooterInner>
                <FooterMenu>
                  {this.context.permissions.includes('write') && (
                    <FooterMenuItem>
                      <Link to="/settings">Site Settings</Link>
                    </FooterMenuItem>
                  )}
                  {changelog && (
                    <FooterMenuItem>
                      <Link to="/changelog">Changelog</Link>
                    </FooterMenuItem>
                  )}
                </FooterMenu>
                <FooterBuiltOn>
                  <a
                    href="https://knapsack.sh"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FooterBuiltOnImg src={knapsackBranding} alt="Knapsack" />
                  </a>
                  <FooterBuiltOnInner>v{knapsackVersion}</FooterBuiltOnInner>
                  {/* <a */}
                  {/*  href="https://basalt.io" */}
                  {/*  target="_blank" */}
                  {/*  rel="noopener noreferrer" */}
                  {/* > */}
                  {/*  <FooterCreatedByImg src={createdBy} alt="Created by" /> */}
                  {/* </a> */}
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
}

export default Footer;
